import { useState, useEffect } from 'react';

interface AutoSaveOptions<T> {
  key: string;
  initialData: T;
  onSave?: (data: T) => Promise<void>;
  saveIntervalMs?: number;
}

export function useAutoSave<T>({ key, initialData, onSave, saveIntervalMs = 30000 }: AutoSaveOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`draft_${key}`);
      if (saved) {
        setData(JSON.parse(saved));
        setIsDirty(true);
      }
    } catch (e) {
      console.error('Error loading draft', e);
    }
  }, [key]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'لديك تغييرات غير محفوظة، هل تريد المغادرة؟';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Auto save to local storage and optionally to server
  useEffect(() => {
    if (!isDirty) return;

    // Save to local storage immediately
    localStorage.setItem(`draft_${key}`, JSON.stringify(data));

    const interval = setInterval(async () => {
      if (onSave && isDirty) {
        setIsSaving(true);
        try {
          await onSave(data);
          setIsDirty(false);
          setLastSaved(new Date());
          localStorage.removeItem(`draft_${key}`);
        } catch (e) {
          console.error('Auto-save failed', e);
        } finally {
          setIsSaving(false);
        }
      }
    }, saveIntervalMs);

    return () => clearInterval(interval);
  }, [data, isDirty, key, onSave, saveIntervalMs]);

  const updateData = (newData: Partial<T> | ((prev: T) => T)) => {
    setData((prev) => {
      const updated = typeof newData === 'function' ? (newData as any)(prev) : { ...prev, ...newData };
      return updated;
    });
    setIsDirty(true);
  };

  const clearDraft = () => {
    localStorage.removeItem(`draft_${key}`);
    setIsDirty(false);
  };

  return { data, updateData, isDirty, isSaving, lastSaved, clearDraft, setData };
}
