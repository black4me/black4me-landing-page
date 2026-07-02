"use client";

import React, { useState, useEffect } from 'react';
import { getAdminSubscribers } from '../../server/actions/admin';
import { Users, Loader2 } from 'lucide-react';
import { NewsletterSubscriber } from '../../types';

export function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await getAdminSubscribers();
      setSubscribers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-purple" /> 
            قائمة المشتركين
          </h3>
          <p className="text-xs text-gray-500">سجل بجميع المستخدمين الذين اشتركوا في القائمة البريدية.</p>
        </div>
        <div className="bg-brand-darkgray px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
          <span className="text-xs text-gray-400">إجمالي المشتركين:</span>
          <span className="text-sm font-bold text-white">{subscribers.length}</span>
        </div>
      </div>

      <div className="bg-brand-darkgray rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#111] border-b border-white/5 text-gray-400 text-xs">
              <tr>
                <th className="p-4 font-bold">الاسم</th>
                <th className="p-4 font-bold">البريد الإلكتروني</th>
                <th className="p-4 font-bold">الدولة</th>
                <th className="p-4 font-bold">تاريخ الاشتراك</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-white/5 transition">
                  <td className="p-4 text-white font-medium">{sub.name || 'غير محدد'}</td>
                  <td className="p-4 text-gray-300 font-mono text-left" dir="ltr">{sub.email}</td>
                  <td className="p-4 text-gray-300">{sub.country || 'غير محدد'}</td>
                  <td className="p-4 text-gray-300">
                    {new Date(sub.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 text-sm">
                    لا يوجد مشتركون بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
