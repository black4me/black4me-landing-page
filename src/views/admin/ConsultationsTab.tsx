"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Video, Clock } from 'lucide-react';

interface Consultation {
  id: string;
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

export function ConsultationsTab() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsultations() {
      const { data } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
      if (data) setConsultations(data);
      setLoading(false);
    }
    fetchConsultations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">الاستشارات</h2>
          <p className="text-gray-400 text-sm">إدارة الحجوزات والجلسات الاستشارية</p>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-bold">العميل</th>
                <th className="px-6 py-4 font-bold">تاريخ الموعد</th>
                <th className="px-6 py-4 font-bold">وقت الموعد</th>
                <th className="px-6 py-4 font-bold">ملاحظات</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500 animate-pulse">
                    جاري تحميل الاستشارات...
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    لا توجد استشارات حالياً
                  </td>
                </tr>
              ) : consultations.map(consult => (
                <tr key={consult.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1">{consult.customer_name}</div>
                    <div className="text-gray-500 text-xs">{consult.customer_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-[#6C3BFF]" />
                      {new Date(consult.appointment_date).toLocaleDateString('ar-EG')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-[#F5C542]" />
                      {consult.appointment_time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-400 text-xs max-w-[200px] truncate" title={consult.notes || ''}>
                      {consult.notes || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      consult.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      consult.status === 'scheduled' ? 'bg-[#6C3BFF]/10 text-[#6C3BFF] border border-[#6C3BFF]/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {consult.status === 'completed' ? 'مكتمل' : 
                       consult.status === 'scheduled' ? 'مجدول' : 'ملغي'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
