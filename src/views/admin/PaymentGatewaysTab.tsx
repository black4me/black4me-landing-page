"use client";
import React, { useState, useEffect } from 'react';
import { getPrivateSettings, updatePrivateSetting } from '../../server/actions/admin';
import { Loader2 } from 'lucide-react';

export function PaymentGatewaysTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    const res = await getPrivateSettings();
    if (res.settings) {
      setSettings(res.settings);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (key: string) => {
    setSaving(true);
    const res = await updatePrivateSetting(key, settings[key] || '');
    setSaving(false);
    if (res.error) {
      alert('خطأ في الحفظ: ' + res.error);
    } else {
      alert('تم الحفظ بنجاح!');
    }
  };

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">بوابات الدفع (Payment Gateways)</h3>
        <p className="text-sm text-gray-400 mb-6">قم بإعداد مفاتيح الاتصال الخاصة بـ Stripe و PayPal.</p>
      </div>

      {/* PayPal Settings */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-md font-semibold text-white">PayPal إعدادات</h4>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">PayPal Mode</label>
          <div className="flex gap-2">
            <select
              name="PAYPAL_MODE"
              value={settings.PAYPAL_MODE || 'live'}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="live">Live (حقيقي)</option>
              <option value="sandbox">Sandbox (تجريبي)</option>
            </select>
            <button onClick={() => handleSave('PAYPAL_MODE')} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap">حفظ</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Client ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="NEXT_PUBLIC_PAYPAL_CLIENT_ID"
              value={settings.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., AUVX..."
            />
            <button onClick={() => handleSave('NEXT_PUBLIC_PAYPAL_CLIENT_ID')} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap">حفظ</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Secret Key</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="PAYPAL_SECRET"
              value={settings.PAYPAL_SECRET || ''}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., EEEp..."
            />
            <button onClick={() => handleSave('PAYPAL_SECRET')} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap">حفظ</button>
          </div>
        </div>
      </div>

      {/* Stripe Settings */}
      <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-md font-semibold text-white">Stripe إعدادات</h4>
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Secret Key</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="STRIPE_SECRET_KEY"
              value={settings.STRIPE_SECRET_KEY || ''}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., sk_live_..."
            />
            <button onClick={() => handleSave('STRIPE_SECRET_KEY')} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap">حفظ</button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Webhook Secret</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="STRIPE_WEBHOOK_SECRET"
              value={settings.STRIPE_WEBHOOK_SECRET || ''}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., whsec_..."
            />
            <button onClick={() => handleSave('STRIPE_WEBHOOK_SECRET')} disabled={saving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap">حفظ</button>
          </div>
        </div>
      </div>

    </div>
  );
}
