"use client";

import React, { useState, useEffect } from 'react';
import { getAdminSubscribers, getCustomerHistoryAdmin } from '../../server/actions/admin';
import { Users, Loader2, Eye, X, BookOpen, Gift, MessageSquare } from 'lucide-react';
import { NewsletterSubscriber } from '../../types';

export function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<NewsletterSubscriber | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const handleViewHistory = async (sub: NewsletterSubscriber) => {
    setSelectedUser(sub);
    setLoadingHistory(true);
    setHistory([]);
    try {
      const hist = await getCustomerHistoryAdmin(sub.email);
      setHistory(hist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'order': return <BookOpen className="w-5 h-5 text-brand-gold" />;
      case 'lead_magnet': return <Gift className="w-5 h-5 text-brand-purple" />;
      case 'consultation': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      default: return <Users className="w-5 h-5 text-gray-400" />;
    }
  };

  const getHistoryTitle = (type: string, details: any) => {
    switch (type) {
      case 'order': return `شراء: ${details.product_id || 'منتج'}`;
      case 'lead_magnet': return `تحميل الهدية المجانية: ${details.magnet || ''}`;
      case 'consultation': return `طلب استشارة`;
      default: return 'نشاط';
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
                <th className="p-4 font-bold text-center">الإجراءات</th>
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
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleViewHistory(sub)}
                      className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white inline-flex"
                      title="سجل العميل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                    لا يوجد مشتركون بعد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer History Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-darkgray border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">سجل العميل</h3>
                <p className="text-sm text-gray-400 font-mono" dir="ltr">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {loadingHistory ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {history.map((item, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-darkgray bg-[#1a1a1a] text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                        {getHistoryIcon(item.type)}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-sm">
                            {getHistoryTitle(item.type, item.details)}
                          </span>
                          <span className="text-xs text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        {item.type === 'order' && (
                          <div className="text-xs text-gray-400 mt-2 flex flex-col gap-1">
                            <p>المبلغ: {item.details.amount} {item.details.currency || 'USD'}</p>
                            <p>الحالة: {item.details.status}</p>
                          </div>
                        )}
                        {item.type === 'consultation' && (
                          <div className="text-xs text-gray-400 mt-2">
                            <p>الاسم: {item.details.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-600" />
                  </div>
                  <h4 className="text-white font-medium mb-1">لا يوجد سجل نشاط</h4>
                  <p className="text-sm text-gray-500">هذا العميل لم يقم بأي نشاطات مسجلة بعد.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
