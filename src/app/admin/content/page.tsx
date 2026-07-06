import React from 'react';
import { Construction } from 'lucide-react';

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-20 h-20 bg-[#ceae88]/10 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-[#ceae88]" />
      </div>
      <h2 className="text-2xl font-black text-white mb-2">هذه الصفحة قيد التطوير</h2>
      <p className="text-gray-400 max-w-md">
        نعمل حالياً على بناء هذه الواجهة لتكون جاهزة قريباً. شكراً لتفهمك!
      </p>
    </div>
  );
}
