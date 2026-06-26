import React, { useState } from 'react';
import { Upload, Calendar, CheckCircle, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';

export function NewsletterTab() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet) as Array<any>;

      if (json.length === 0) {
        throw new Error('الملف فارغ');
      }

      const res = await fetch('/api/admin/schedule-newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaigns: json })
      });

      const responseData = await res.json();
      if (responseData.success) {
        setSuccess('تم جدولة النشرات بنجاح!');
        setFile(null);
      } else {
        throw new Error(responseData.error || 'فشل في عملية الجدولة');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء معالجة الملف');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-bold text-white">جدولة النشرات البريدية (Excel)</h3>
        <p className="text-xs text-gray-500">ارفع ملف إكسل يحتوي على نصوص النشرة البريدية ليتم تحويلها تلقائياً إلى نماذج برمجية (Blueprints) وجدولتها.</p>
      </div>

      <div className="bg-brand-darkgray border border-brand-white/5 p-6 rounded-2xl max-w-2xl">
        <form onSubmit={handleUpload} className="space-y-6">
          
          <div className="border-2 border-dashed border-brand-white/10 rounded-xl p-8 text-center hover:border-brand-purple/50 transition">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileChange} 
              className="hidden" 
              id="excel-upload"
            />
            <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-brand-gold mb-3" />
              <span className="text-sm font-bold text-white mb-1">اختر ملف الإكسل</span>
              <span className="text-xs text-gray-500">الصيغ المدعومة: XLSX, XLS, CSV</span>
              {file && (
                <div className="mt-4 px-4 py-2 bg-brand-white/5 rounded-lg text-brand-green font-mono text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {file.name}
                </div>
              )}
            </label>
          </div>

          <div className="bg-[#111] p-4 rounded-xl border border-brand-white/5 text-xs text-gray-400 space-y-2">
            <h4 className="font-bold text-brand-gold mb-2">كيفية إعداد ملف الإكسل:</h4>
            <p>يجب أن يحتوي الملف على الأعمدة التالية في الصف الأول (Header):</p>
            <ul className="list-disc list-inside space-y-1 mr-2 text-gray-300">
              <li><span className="text-brand-purple font-mono">Subject</span>: عنوان الرسالة</li>
              <li><span className="text-brand-purple font-mono">BodyText</span>: النص أو الشرح الذي سيتم إدراجه داخل الرسالة</li>
              <li><span className="text-brand-purple font-mono">TemplateType</span>: نوع النموذج (<span className="text-brand-gold">conversion</span>, <span className="text-brand-gold">retention</span>, <span className="text-brand-gold">anniversary</span>)</li>
              <li><span className="text-brand-purple font-mono">ScheduledAt</span>: تاريخ ووقت الإرسال (مثال: 2026-07-01T10:00:00Z)</li>
            </ul>
          </div>

          {error && <p className="text-brand-red text-xs font-bold bg-brand-red/10 p-3 rounded-lg border border-brand-red/20">{error}</p>}
          {success && <p className="text-brand-green text-xs font-bold bg-brand-green/10 p-3 rounded-lg border border-brand-green/20">{success}</p>}

          <button
            type="submit"
            disabled={!file || isLoading}
            className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold text-sm px-4 py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? 'جاري المعالجة والجدولة...' : 'تأكيد رفع الملف وجدولة النشرات'}
            {!isLoading && <Clock className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
