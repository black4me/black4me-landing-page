import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Product, Order, Consultation, Testimonial, FAQ } from '../types';
import { 
  BarChart3, Plus, Edit2, Trash2, CheckCircle, XCircle, Search, 
  Download, Filter, ArrowUp, Calendar, ClipboardList, HelpCircle, 
  MessageSquare, Sparkles, Tag
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    products, orders, consultations, subscribers, testimonials, faqs,
    addProduct, updateProduct, deleteProduct,
    updateOrder, updateConsultationStatus,
    approveTestimonial, rejectTestimonial,
    addFAQ, updateFAQ, deleteFAQ
  } = useApp();

  // Active admin tab switcher
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'consultations' | 'testimonials' | 'faqs'>('stats');

  // Customer List states (Orders matched with Subscribers)
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerCountryFilter, setCountryFilter] = useState('ALL');

  // Product CRUD states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(49);
  const [newSalePrice, setNewSalePrice] = useState(0);
  const [newDesc, setNewDesc] = useState('');

  // FAQ CRUD states
  const [isAddingFAQ, setIsAddingFAQ] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newOrderIndex, setNewOrderIndex] = useState(1);

  // Math Statistics counters
  const totalSales = orders.filter(o => o.status === 'completed').reduce((acc, o) => acc + o.amount, 0);
  const totalOrdersCount = orders.length;
  const subscribersCount = subscribers.length;
  const consultationsCount = consultations.length;

  // Custom simulation files exporter for Customers or Orders data
  const exportToCSV = (dataType: 'orders' | 'subscribers') => {
    let csvContent = "";
    if (dataType === 'orders') {
      csvContent = "ID,Customer Name,Customer Email,Product,Amount,Gateway,Status,Date\n";
      orders.forEach(o => {
        csvContent += `"${o.id}","${o.customerName}","${o.customerEmail}","${o.productTitle}",$${o.amount},"${o.paymentGateway}","${o.status}","${o.createdAt}"\n`;
      });
    } else {
      csvContent = "ID,Name,Email,Country,Signup Date\n";
      subscribers.forEach(s => {
        csvContent += `"${s.id}","${s.name}","${s.email}","${s.country}","${s.createdAt}"\n`;
      });
    }

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `b4m_${dataType}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler for Product CRUD
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: newTitle,
        price: Number(newPrice),
        salePrice: Number(newSalePrice) > 0 ? Number(newSalePrice) : undefined,
        description: newDesc
      });
      setEditingProduct(null);
    } else {
      addProduct({
        title: newTitle,
        description: newDesc,
        price: Number(newPrice),
        salePrice: Number(newSalePrice) > 0 ? Number(newSalePrice) : undefined,
        features: ["ميزة مضافة مخصصة"],
        isActive: true
      });
      setIsAddingProduct(false);
    }
    setNewTitle('');
    setNewPrice(49);
    setNewSalePrice(0);
    setNewDesc('');
  };

  // Handler for FAQ CRUD
  const handleFAQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      updateFAQ(editingFAQ.id, {
        question: newQuestion,
        answer: newAnswer,
        orderIndex: Number(newOrderIndex)
      });
      setEditingFAQ(null);
    } else {
      addFAQ({
        question: newQuestion,
        answer: newAnswer,
        orderIndex: Number(newOrderIndex)
      });
      setIsAddingFAQ(false);
    }
    setNewQuestion('');
    setNewAnswer('');
    setNewOrderIndex(faqs.length + 1);
  };

  return (
    <div className="bg-brand-black min-h-screen text-brand-white p-6 sm:p-12" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-white/10 pb-6 gap-4">
          <div>
            <span className="text-brand-gold font-bold text-xs uppercase bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded-full inline-block mb-1">لوحة تحكم المسؤول المالي</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إدارة منصة BLACK4ME والعملاء والطلبات</h1>
          </div>
          <a href="/index.html" className="text-xs bg-brand-darkgray hover:bg-brand-white/5 border border-brand-white/10 px-4 py-2 rounded-xl text-gray-300 transition">
            زيارة واجهة المستخدم الرئيسية
          </a>
        </div>

        {/* Administration Grid of Nav Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-brand-white/5 pb-2">
          {[
            { id: 'stats', label: "لوحة مؤشرات الأداء والعملاء", icon: BarChart3 },
            { id: 'products', label: "إدارة الكتب والمنتجات الرقمية", icon: Tag },
            { id: 'orders', label: "إدارة عمليات الطلب والدفع", icon: ClipboardList },
            { id: 'consultations', label: "إدارة جلسات الاستشارات", icon: Calendar },
            { id: 'testimonials', label: "مراجعة واعتماد آراء العملاء", icon: MessageSquare },
            { id: 'faqs', label: "أدوات مراجعة الأسئلة الشائعة", icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-brand-purple text-white shadow-lg' 
                    : 'bg-brand-darkgray text-gray-400 hover:text-white hover:bg-brand-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active tab content switcher */}
        <div className="animate-fadeIn">
          
          {/* TAB 1: General Stats and Overview */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-brand-darkgray p-6 border border-brand-white/5 rounded-2xl">
                  <span className="text-xs text-brand-green font-bold uppercase block mb-1">إجمالي المبيعات المحصلة</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-brand-green font-mono">${totalSales}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">%100 دفع ناجح</span>
                  </div>
                </div>

                <div className="bg-brand-darkgray p-6 border border-brand-white/5 rounded-2xl">
                  <span className="text-xs text-gray-400 font-bold uppercase block mb-1">إجمالي طلبات الشراء</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-white font-mono">{totalOrdersCount}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">{orders.filter(o => o.status === 'completed').length} مكتملة</span>
                  </div>
                </div>

                <div className="bg-brand-darkgray p-6 border border-brand-white/5 rounded-2xl">
                  <span className="text-xs text-brand-purple font-bold uppercase block mb-1">مشتركو النشرة البريدية</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-brand-purple font-mono">{subscribersCount}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">بوابة Brevo نشطة</span>
                  </div>
                </div>

                <div className="bg-brand-darkgray p-6 border border-brand-white/5 rounded-2xl">
                  <span className="text-xs text-brand-gold font-bold uppercase block mb-1">الاستشارات المحجوزة</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-brand-gold font-mono">{consultationsCount}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">مزامنة Calendly نشطة</span>
                  </div>
                </div>

              </div>

              {/* Matched Customers Profile Search and filter tool */}
              <div className="bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-none">إدارة بيانات ومحركات العملاء</h3>
                    <p className="text-xs text-gray-500 mt-1">البحث في ملفات العملاء المسجلين وتصفية مواقع الإقامة لغايات الاستهداف البريدي.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => exportToCSV('subscribers')}
                      className="bg-brand-purple hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>تصدير العملاء (Generative CSV)</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      placeholder="البحث بالاسم أو البريد الإلكتروني للعميل..."
                      className="w-full bg-brand-black border border-brand-white/10 pr-10 pl-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-right text-gray-300">
                    <thead className="bg-brand-black text-gray-400 border-b border-brand-white/5">
                      <tr>
                        <th className="p-3">اسم المقتني</th>
                        <th className="p-3">البريد الإلكتروني المبرهن</th>
                        <th className="p-3">الدولة</th>
                        <th className="p-3">تاريخ تسجيل الاهتمام</th>
                        <th className="p-3">الحالة البريدية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-white/5">
                      {subscribers.map((item) => (
                        <tr key={item.id} className="hover:bg-brand-white/[0.01]">
                          <td className="p-3 font-bold text-white">{item.name}</td>
                          <td className="p-3 font-mono">{item.email}</td>
                          <td className="p-3 text-brand-gold">{item.country}</td>
                          <td className="p-3">{new Date(item.createdAt).toLocaleDateString('ar-SA')}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-full">
                              مفعل بريدياً
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Product CRM (Digital Products addition, Editing / deleting) */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">إدارة المنتجات والأصول الرقمية</h3>
                  <p className="text-xs text-gray-500">إضافة وتحديث أسعار وتفاصيل الكتب والتنزيلات الرقمية الخاصة بـ BLACK4ME.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setNewTitle('');
                    setNewPrice(49);
                    setNewDesc('');
                    setIsAddingProduct(!isAddingProduct);
                  }}
                  className="bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج رقمي جديد</span>
                </button>
              </div>

              {/* Form container for product additions/edits */}
              {(isAddingProduct || editingProduct) && (
                <div className="bg-brand-darkgray border border-brand-gold/30 p-6 sm:p-8 rounded-2xl max-w-2xl text-xs font-semibold animate-fadeIn space-y-4">
                  <h4 className="text-sm font-bold text-brand-gold">
                    {editingProduct ? `تعديل المنتج الراهن: ${editingProduct.title}` : 'تأسيس وتعريف منتج رقمي جديد'}
                  </h4>

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="text-gray-400 block mb-1">عنوان المنتج / الكتاب</label>
                      <input 
                        type="text" 
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="مثل: كتاب أسرار الإشهار..."
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 block mb-1">السعر الأساسي ($ دولار)</label>
                        <input 
                          type="number" 
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                          className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-mono" 
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">السعر المخفض حال الانطلاق ($ دولار)</label>
                        <input 
                          type="number" 
                          value={newSalePrice}
                          onChange={(e) => setNewSalePrice(Number(e.target.value))}
                          className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-mono" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">شرح فوائد ومحتويات المنتج</label>
                      <textarea 
                        required
                        rows={3}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="اكتب تفاصيل القيمة المضافة هنا..."
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white resize-none" 
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold px-5 py-2.5 rounded-lg transition cursor-pointer"
                      >
                        حفظ وتحديث قاعدة البيانات
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsAddingProduct(false);
                          setEditingProduct(null);
                        }}
                        className="bg-transparent border border-brand-white/10 text-gray-400 px-4 py-2.5 rounded-lg hover:text-white transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Products List Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-brand-darkgray border border-brand-white/5 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
                    <div className="space-y-2">
                      <h4 className="text-sm font-extrabold text-white">{p.title}</h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm line-clamp-3">{p.description}</p>
                    </div>

                    <div className="pt-4 border-t border-brand-white/5 mt-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-gold font-bold">${p.salePrice || p.price} USD</span>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setNewTitle(p.title);
                            setNewPrice(p.price);
                            setNewSalePrice(p.salePrice || 0);
                            setNewDesc(p.description);
                          }}
                          className="p-1 px-2.5 bg-brand-purple/10 border border-brand-purple/30 text-brand-gold rounded hover:bg-brand-purple/20 transition cursor-pointer text-[10px]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('هل أنت متأكد من رغبتك في حذف هذا الأصل المعرفي؟')) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 px-2.5 bg-brand-red/10 border border-brand-red/30 text-brand-red rounded hover:bg-brand-red/20 transition cursor-pointer text-[10px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Orders List logging and Export Excel/CSV */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white leading-none">إدارة ومتابعة طلبات الدفع والمبيعات</h3>
                  <p className="text-xs text-gray-500 mt-1">سجل المبيعات المكتملة، وبوابات الدفع المستخدمة للعلامة والتحقق من التراخيص.</p>
                </div>
                <button
                  onClick={() => exportToCSV('orders')}
                  className="bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير المبيعات (CSV Spreadsheet)</span>
                </button>
              </div>

              <div className="bg-brand-darkgray border border-brand-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-right text-gray-300">
                    <thead className="bg-brand-black text-gray-400 border-b border-brand-white/5">
                      <tr>
                        <th className="p-3">رقم الطلب</th>
                        <th className="p-3">اسم المقتني</th>
                        <th className="p-3">البريد الإلكتروني</th>
                        <th className="p-3">المبلغ المستحق</th>
                        <th className="p-3">المنصة المالية</th>
                        <th className="p-3">حالة السداد</th>
                        <th className="p-3">المصادقة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-white/5">
                      {orders.map((it) => (
                        <tr key={it.id} className="hover:bg-brand-white/[0.01]">
                          <td className="p-3 font-mono text-brand-purple">{it.id}</td>
                          <td className="p-3 font-bold text-white">{it.customerName}</td>
                          <td className="p-3 font-mono">{it.customerEmail}</td>
                          <td className="p-3 font-bold">${it.amount} USD</td>
                          <td className="p-3 uppercase font-semibold">{it.paymentGateway}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              it.status === 'completed' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                            }`}>
                              {it.status === 'completed' ? 'تلقائي كامل' : 'ملغى / فشل'}
                            </span>
                          </td>
                          <td className="p-3">
                            {it.status === 'failed' ? (
                              <button 
                                onClick={() => updateOrder(it.id, 'completed')}
                                className="text-[10px] text-brand-green font-bold bg-brand-green/10 border border-brand-green/20 px-2 py-0.5 rounded-lg hover:bg-brand-green/20 cursor-pointer"
                              >
                                تحويل لماكتمل
                              </button>
                            ) : (
                              <span className="text-gray-500 font-semibold text-[10px]">مكتمل قانوناً</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Consultation database schedule */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">إدارة طلبات جلسات الاستشارات الاستراتيجية</h3>
                <p className="text-xs text-gray-500">مواعيد جلسات 1:1 مع رواد الأعمال المقتنين لحزمة BLACK4ME.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {consultations.map((item) => (
                  <div key={item.id} className="bg-brand-darkgray border border-brand-white/5 p-5 rounded-2xl relative shadow-lg space-y-4">
                    <div className="flex justify-between items-start border-b border-brand-white/5 pb-3">
                      <div>
                        <span className="text-[9px] text-brand-gold font-bold block uppercase font-mono">APP-ID: {item.id}</span>
                        <h4 className="text-sm font-bold text-white mt-1">{item.customerName}</h4>
                        <p className="text-xs text-brand-purple font-mono font-bold mt-0.5">{item.customerEmail}</p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold pb-1 ${
                        item.status === 'scheduled' ? 'bg-brand-gold/15 text-brand-gold' : 'bg-brand-green/10 text-brand-green'
                      }`}>
                        {item.status === 'scheduled' ? 'في انتظار الجلسة' : 'تم الاكتمال ومشاركه التقارير'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex gap-2 text-gray-300 font-bold leading-normal">
                        <span>موعد اللقاء المحدد:</span>
                        <span className="text-brand-purple font-semibold font-mono">{item.appointmentDate} مـ الساعة {item.appointmentTime}</span>
                      </div>
                      <p className="text-gray-400 leading-normal font-medium">{item.notes ? `أهداف العميل: "${item.notes}"` : 'لم يدرج العميل ملاحظات خاصة مسبقة.'}</p>
                    </div>

                    <div className="pt-4 border-t border-brand-white/5 flex gap-2">
                      {item.status === 'scheduled' && (
                        <button
                          onClick={() => updateConsultationStatus(item.id, 'completed')}
                          className="bg-brand-green hover:bg-green-600 text-brand-black text-[10px] font-extrabold px-3 py-1.5 rounded transition cursor-pointer"
                        >
                          تحديد كجلسة مكتملة ومثبتة
                        </button>
                      )}
                      <button
                        onClick={() => updateConsultationStatus(item.id, 'cancelled')}
                        className="bg-transparent border border-brand-white/10 text-brand-red text-[10px] font-bold hover:bg-brand-red/10 transition px-3 py-1.5 rounded cursor-pointer"
                      >
                        إلغاء الموعد المقترح
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Testimonials Moderation panel */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">إشهار ومراجعة شهادات رواد الأعمال</h3>
                <p className="text-xs text-gray-500">لوحة الاعتماد لتوضيح شيكات آراء العملاء قبل السماح بنشرها للزوار في صفحة الهبوط.</p>
              </div>

              <div className="bg-brand-darkgray border border-brand-white/5 rounded-2xl overflow-hidden p-6">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-right text-gray-300">
                    <thead className="bg-brand-black text-gray-400 border-b border-brand-white/5">
                      <tr>
                        <th className="p-3">اسم كاتب التقييم</th>
                        <th className="p-3">بلد العميل</th>
                        <th className="p-3">التقييم الرقمي</th>
                        <th className="p-3 max-w-[300px]">التعليق والمقالة</th>
                        <th className="p-3">الوضع الحالي</th>
                        <th className="p-3 text-left">أدوات التحكم بالسيرورة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-white/5">
                      {testimonials.map((test) => (
                        <tr key={test.id} className="hover:bg-brand-white/[0.01]">
                          <td className="p-3 font-bold text-white">{test.customerName}</td>
                          <td className="p-3">{test.country}</td>
                          <td className="p-3 text-brand-gold font-bold">{test.rating} ★</td>
                          <td className="p-3 max-w-[300px] truncate leading-relaxed text-gray-400 font-medium font-semibold" title={test.comment}>
                            {test.comment}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              test.isApproved ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                            }`}>
                              {test.isApproved ? 'معتمد ومنشور' : 'جاري التدقيق والمعالجة'}
                            </span>
                          </td>
                          <td className="p-3 text-left flex gap-1 justify-end">
                            {!test.isApproved ? (
                              <button
                                onClick={() => approveTestimonial(test.id)}
                                className="bg-brand-green/20 border border-brand-green/35 text-brand-green hover:bg-brand-green text-brand-black hover:text-white text-[10px] font-bold px-2 py-1 rounded transition cursor-pointer"
                              >
                                اعتماد ونشر
                              </button>
                            ) : (
                              <button
                                onClick={() => rejectTestimonial(test.id)}
                                className="bg-brand-red/15 border border-brand-red/30 text-brand-red text-[10px] font-bold px-2 py-1 rounded hover:bg-brand-red/20 transition cursor-pointer"
                              >
                                حظر / إخفاء
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FAQ Custom additions, adjustments */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">إعدادات أسئلة العملاء والاعتراضات التسويقية</h3>
                  <p className="text-xs text-gray-500">تمكين وتحديث وإعادة فرز الأسئلة الشائعة لمعالجة العقد الشرائية للزوار.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFAQ(null);
                    setNewQuestion('');
                    setNewAnswer('');
                    setNewOrderIndex(faqs.length + 1);
                    setIsAddingFAQ(!isAddingFAQ);
                  }}
                  className="bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة سؤال وجواب جديد</span>
                </button>
              </div>

              {/* Form container for FAQ additions */}
              {(isAddingFAQ || editingFAQ) && (
                <div className="bg-brand-darkgray border border-brand-gold/30 p-6 sm:p-8 rounded-2xl max-w-xl text-xs font-semibold animate-fadeIn space-y-4">
                  <h4 className="text-sm font-bold text-brand-gold">
                    {editingFAQ ? 'تحديث وتعديل السؤال' : 'تعريف وإضافة سؤال ذكي'}
                  </h4>

                  <form onSubmit={handleFAQSubmit} className="space-y-4">
                    <div>
                      <label className="text-gray-400 block mb-1">السؤال المقترح</label>
                      <input 
                        type="text" 
                        required
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="مثل: هل يتطلب النظام خبرة تقنية؟"
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-semibold" 
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">الترتيب الرقمي للظهور</label>
                      <input 
                        type="number" 
                        required
                        value={newOrderIndex}
                        onChange={(e) => setNewOrderIndex(Number(e.target.value))}
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white font-mono" 
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 block mb-1">الإجابة الهدية وحلول الاعتراض</label>
                      <textarea 
                        required
                        rows={3}
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="اكتب الإجابة المفصلة الشافية هنا..."
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-lg text-white resize-none" 
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold px-5 py-2.5 rounded-lg transition cursor-pointer"
                      >
                        حفظ السؤال بالقائمة
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setIsAddingFAQ(false);
                          setEditingFAQ(null);
                        }}
                        className="bg-transparent border border-brand-white/10 text-gray-400 px-4 py-2.5 rounded-lg hover:text-white transition"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* FAQs List for deletion and updating */}
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="bg-brand-darkgray border border-brand-white/5 p-4 sm:p-6 rounded-xl flex justify-between items-center gap-4 shadow">
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] text-brand-purple font-mono font-bold block">ترتيب الاستعراض: {f.orderIndex}</span>
                      <h4 className="text-sm font-extrabold text-white leading-none mt-1">{f.question}</h4>
                      <p className="text-xs text-gray-400 leading-normal font-semibold font-medium truncate max-w-xl">{f.answer}</p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingFAQ(f);
                          setNewQuestion(f.question);
                          setNewAnswer(f.answer);
                          setNewOrderIndex(f.orderIndex);
                        }}
                        className="p-1 px-2.5 bg-brand-purple/10 border border-brand-purple/30 text-brand-gold rounded hover:bg-brand-purple/20 transition cursor-pointer text-[10px]"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                            deleteFAQ(f.id);
                          }
                        }}
                        className="p-1 px-2.5 bg-brand-red/10 border border-brand-red/30 text-brand-red rounded hover:bg-brand-red/20 transition cursor-pointer text-[10px]"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
