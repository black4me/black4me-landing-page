import React from 'react';
import { Layout, Globe, Search, Link as LinkIcon, Edit, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PagesTab() {
  const pagesList = [
    {
      name: 'الصفحة الرئيسية (البيع وهبوط الكتاب)',
      route: '/',
      description: 'عرض المبيعات الرئيسي لـ "بدون تسويق كارثة"، وحزم الخدمات، ونموذج الهدية المجانية.',
      status: 'نشطة وتتلقى زيارات',
      seo: 'بدون تسويق كارثة تهدد ثروتك المستقبلية',
      management: 'يتم التحكم بنصوصها وعناصرها بالكامل من خلال تبويب "إعدادات النظام" و "الشهادات"'
    },
    {
      name: 'صفحة إتمام الدفع (Checkout Page)',
      route: '/checkout',
      description: 'بوابة الدفع الإلكتروني الموحدة التي تدعم بطاقات الائتمان عبر Stripe ودفع PayPal والحوالات البنكية.',
      status: 'نشطة وتستقبل أموال',
      seo: 'إتمام الطلب بأمان — BLACK4ME',
      management: 'يتم استرجاع المفاتيح من جدول "private_settings" وإدارة بوابات الدفع من لوحة التحكم'
    },
    {
      name: 'صفحة حجز الاستشارات الفردية',
      route: '/consultation',
      description: 'الصفحة المدمجة التي تتيح للعملاء حجز استشاراتهم المجانية أو المدفوعة وتأكيدها.',
      status: 'نشطة وتستقبل حجوزات',
      seo: 'حجز الاستشارة المباشرة — جاسم محمد',
      management: 'متصلة بالكامل بأتمتة Cal.com و Activepieces لإرسال تفاصيل الاجتماعات فورياً'
    },
    {
      name: 'المدونة ومقالات المعرفة',
      route: '/blog',
      description: 'أرشيف المقالات والتدوينات التعليمية لتحسين الـ SEO وجذب عملاء مجانيين.',
      status: 'نشطة ومحسنة للـ SEO',
      seo: 'المدونة المعرفية للتسويق — BLACK4ME',
      management: 'تتم إدارتها وإضافة مقالات وكتّاب جدد من تبويب "المدونة" و "الكتّاب" و "الإشراف" باللوحة'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">إدارة وتصميم صفحات الموقع (Sitemap & Page Setup)</h3>
        <p className="text-sm text-gray-500">نظرة عامة على هيكلية الصفحات الفعالة وحالة الـ SEO في متجرك.</p>
      </div>

      <div className="bg-[#161b22] border border-gray-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h4 className="text-sm text-white font-bold flex items-center gap-2">
            <Layout className="w-4 h-4 text-brand-gold" />
            الصفحات الفعالة بالموقع ({pagesList.length})
          </h4>
        </div>

        <div className="divide-y divide-gray-800">
          {pagesList.map((page, idx) => (
            <div key={idx} className="p-6 hover:bg-[#1f242c] transition duration-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-md font-bold text-white">{page.name}</span>
                    <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {page.route}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 max-w-2xl">{page.description}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 pt-1">
                    <span>🔍 SEO Title: <strong className="text-gray-300">{page.seo}</strong></span>
                    <span>🛠️ طريقة الإدارة: <strong className="text-gray-300">{page.management}</strong></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-start md:self-center">
                  <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 whitespace-nowrap">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {page.status}
                  </span>
                  <a
                    href={page.route}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[#0d1117] hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-800 transition"
                    title="زيارة الصفحة"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
