'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin/crm' },
    { name: 'Leads', path: '/admin/crm/leads' },
    { name: 'Funnel', path: '/admin/crm/funnel' },
    { name: 'Offers', path: '/admin/crm/offers' },
    { name: 'Sequences', path: '/admin/crm/sequences' },
    { name: 'Integrations', path: '/admin/crm/integrations' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">BLACK4ME LEAD CRM</h1>
        <nav className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 pb-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`px-4 py-2 rounded-t-md font-medium text-sm transition-colors ${
                pathname === item.path
                  ? 'bg-red-600 text-white'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
