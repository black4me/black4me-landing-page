const fs = require('fs');
const path = require('path');
const createPlaceholder = (r, title) => {
  const d = path.join('src/app/admin', r);
  fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(path.join(d, 'page.tsx'), `import React from "react";\n\nexport default function Page() {\n  return (\n    <div className="p-6">\n      <h1 className="text-2xl font-bold mb-4">${title}</h1>\n      <p className="text-gray-400">جاري نقل هذه الصفحة إلى النظام الجديد. ستتوفر قريباً.</p>\n    </div>\n  );\n}\n`);
  console.log(r);
};
createPlaceholder('stats', 'نظرة عامة');
createPlaceholder('orders', 'الطلبات');
createPlaceholder('consultations', 'الاستشارات');
