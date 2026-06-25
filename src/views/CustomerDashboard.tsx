import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, BookOpen, Download, Calendar, History, UserCheck, ShieldCheck, Mail } from 'lucide-react';

export default function CustomerDashboard() {
  const { currentUser, orders, consultations, products, loginAs, logout } = useApp();

  // Profile update form states
  const [name, setName] = useState(currentUser?.name || 'عبدالله اليافعي');
  const [email, setEmail] = useState(currentUser?.email || 'abdullah@example.com');
  const [country, setCountry] = useState(currentUser?.country || 'المملكة العربية السعودية');
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Filter items owned/ordered by the current user
  const userOrders = orders.filter(o => o.customerEmail?.toLowerCase() === email.toLowerCase());
  const userConsultations = consultations.filter(c => c.customerEmail?.toLowerCase() === email.toLowerCase());

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdated(true);
    setTimeout(() => setProfileUpdated(false), 4000);
  };

  const handleDownload = (fileName: string) => {
    alert(`[تنزيل رقمي] جاري تنزيل ملف "${fileName}" بجودة عالية PDF فورا... المرجو حفظ ملفاتك.`);
  };

  // If visitor is not logged in as a Customer, show a login simulation panel
  if (!currentUser || currentUser.role !== 'customer') {
    return (
      <div className="bg-brand-black min-h-screen text-brand-white py-16 px-4 flex items-center justify-center rtl" dir="rtl">
        <div className="max-w-md w-full bg-brand-darkgray border border-brand-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-brand-purple font-bold text-xs uppercase bg-brand-purple/10 border border-brand-purple/20 px-3 py-1 rounded-full">محاكي الدخول الآمن</span>
            <h2 className="text-2xl font-black text-white">بوابة عميل BLACK4ME</h2>
            <p className="text-xs text-gray-400">الرجاء إدخال البريد المسجل لتصفح كتبك والحجوزات الفعالة.</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            loginAs('customer', { name: 'عبدالله الرميثي', email: 'reem.m@example.com' });
          }} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">البريد الإلكتروني المعتمد عند الشراء</label>
              <input 
                type="email" 
                required
                defaultValue="reem.m@example.com"
                placeholder="reem.m@example.com"
                className="w-full bg-brand-black border border-brand-white/10 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple text-left font-mono"
              />
              <span className="text-[10px] text-gray-500 block mt-1">تلميح تجريبي: استخدم (reem.m@example.com) لمحاكاة الحساب الممتلك.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold py-3 rounded-xl transition cursor-pointer text-sm"
            >
              تسجيل الدخول الفوري للعميل
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-black min-h-screen text-brand-white p-6 sm:p-12 rtl" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Header Card */}
        <div className="bg-brand-darkgray border border-brand-white/5 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 bg-brand-purple/20 border-2 border-brand-purple rounded-full flex items-center justify-center font-bold text-xl text-brand-gold">
              {currentUser.name.charAt(0)}
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentUser.name}</h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-semibold">
                <span>تاريخ الانضمام: {new Date(currentUser.createdAt).toLocaleDateString('ar-SA')}</span>
                <span>•</span>
                <span className="text-brand-green">عضو مقتني معتمد دائم</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="text-xs text-brand-red bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/25 px-4 py-2 rounded-lg font-bold transition cursor-pointer"
          >
            تسجيل الخروج من الحساب
          </button>
        </div>

        {/* Triple grid blocks */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Library of purchased PDFs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Download library card */}
            <div className="bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-brand-white/5 pb-4">
                <BookOpen className="w-5 h-5 text-brand-gold" />
                <span>مكتبة الأصول والكتب الرقمية الخاصة بك</span>
              </h3>

              <div className="space-y-4">
                
                {userOrders.map(ord => {
                  const product = products.find(p => p.id === ord.productId);
                  if (!product) return null;
                  return (
                    <div key={ord.id} className="bg-brand-black p-5 rounded-xl border border-brand-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-gold font-bold bg-brand-gold/10 px-2 py-0.5 rounded">محتوى رقمي مرخص</span>
                        <h4 className="text-base font-bold text-white mt-1">{product.title}</h4>
                        <p className="text-xs text-gray-400 font-semibold">{product.description}</p>
                      </div>
                      {product.fileUrl ? (
                        <a
                          href={product.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-black text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل / استلام المنتج</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleDownload(`${product.title}.pdf`)}
                          className="px-4 py-2 bg-brand-gold hover:bg-yellow-500 text-brand-black text-xs font-bold rounded-lg transition duration-150 cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <Download className="w-4 h-4" />
                          <span>تحميل نسخة الـ PDF المفصلة</span>
                        </button>
                      )}
                    </div>
                  );
                })}
                {userOrders.length === 0 && (
                  <div className="text-center py-6 text-xs text-gray-500 font-semibold bg-brand-black/30 p-4 rounded-xl">
                    لا توجد منتجات رقمية في مكتبتك حالياً.
                  </div>
                )}
              </div>
            </div>

            {/* Scheduled Consultations card */}
            <div className="bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-brand-white/5 pb-4">
                <Calendar className="w-5 h-5 text-brand-purple" />
                <span>جلسات الاستشارات المجدولة</span>
              </h3>

              {userConsultations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs font-medium space-y-2">
                  <p>لا توجد جلسات مجدولة حالياً على هذا البريد الإلكتروني.</p>
                  <a href="#consultations-section" className="text-brand-purple hover:underline font-bold">حجز الجلسة المجانية الأولى ←</a>
                </div>
              ) : (
                <div className="space-y-3">
                  {userConsultations.map((item) => (
                    <div key={item.id} className="bg-brand-black p-4 rounded-xl border border-brand-white/5 flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-gold font-bold">موعد استشاري مباشر لـ 1:1</span>
                        <h4 className="font-bold text-white">يوم: {item.appointmentDate} مـ في تمام الساعة {item.appointmentTime}</h4>
                        <p className="text-gray-500 font-medium">{item.notes ? `سبب الجلسة: ${item.notes}` : 'بدون ملاحظات إضافية'}</p>
                      </div>
                      <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-1 rounded-full font-bold">
                        مجدول ومؤكد
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Invoices History lists card */}
            <div className="bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-brand-white/5 pb-4">
                <History className="w-5 h-5 text-gray-400" />
                <span>سجل المشتريات والطلبات المالية</span>
              </h3>

              {userOrders.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 font-semibold bg-brand-black/30 p-4 rounded-xl">
                  (هناك مشتريات افتراضية معلقة باسم "خالد" و"ريم المطيري"). لا توجد فواتير مباشرة مسجلة لبريدك الحالي حتى الآن.
                </div>
              ) : (
                <div className="overflow-x-auto text-xs text-right text-gray-300">
                  <table className="w-full text-right">
                    <thead className="bg-brand-black text-gray-400 border-b border-brand-white/5">
                      <tr>
                        <th className="p-3 font-bold">رقم الفاتورة</th>
                        <th className="p-3 font-bold">المنتج والترخيص</th>
                        <th className="p-3 font-bold">بوابة السداد</th>
                        <th className="p-3 font-bold">الحالة</th>
                        <th className="p-3 font-bold">المبلغ السداد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-white/5">
                      {userOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-brand-white/[0.01]">
                          <td className="p-3 font-mono text-brand-purple">{ord.id}</td>
                          <td className="p-3 font-bold text-white">{ord.productTitle}</td>
                          <td className="p-3 uppercase">{ord.paymentGateway}</td>
                          <td className="p-3 text-brand-green font-bold">ناجح كامل</td>
                          <td className="p-3 font-bold text-white">${ord.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

          {/* Left Column: Update profile settings */}
          <div className="lg:col-span-4 bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-brand-white/5 pb-4">
              <UserCheck className="w-5 h-5 text-brand-gold" />
              <span>إعدادات وتحديث الحساب المعتمد</span>
            </h3>

            {profileUpdated && (
              <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green p-3 rounded-xl text-xs font-semibold text-center mb-4">
                تم تحديث معلومات ملفك الشخصي بنجاح!
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-medium">
              <div>
                <label className="text-gray-400 block mb-1">الاسم بالكامل</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-semibold focus:outline-none focus:border-brand-purple transition" 
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">البريد الإلكتروني المعتمد</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-mono focus:outline-none focus:border-brand-purple transition" 
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">مكان الإقامة أو الدولة الحالي</label>
                <input 
                  type="text" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-semibold focus:outline-none focus:border-brand-purple transition" 
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-purple hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition cursor-pointer"
              >
                تحديث وحفظ بيانات الترخيص
              </button>
            </form>

            <div className="bg-brand-black border border-brand-white/10 p-4 rounded-xl mt-6">
              <span className="text-[10px] text-gray-500 font-bold block mb-1.5 uppercase">الامتثال والأمن الرقمي</span>
              <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                بياناتك وتراخيص التنزيل محمية بشيكات أمنية دورية بالتعاون مع بروتوكولات الخصوصية وحظر التسريبات الممنهجة وعقوبات الحظر الرقمي.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
