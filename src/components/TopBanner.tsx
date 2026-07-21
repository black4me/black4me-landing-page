'use client';
import { useApp } from '../context/AppContext';
import CountdownTimer from './CountdownTimer';

export default function TopBanner() {
  const { siteSettings } = useApp();

  if (siteSettings.enable_top_banner !== 'true') return null;

  return (
    <div className="bg-red-600 text-white font-bold relative z-[60] flex flex-col md:flex-row items-center justify-center border-b-4 border-black">
      <div className="flex-1 w-full flex items-center justify-center p-2">
        <CountdownTimer 
          hours={24} 
          label={siteSettings.top_banner_text || 'عرض محدود: احصل على خصم 75% اليوم فقط!'} 
          targetDate={siteSettings.countdown_end_date} 
        />
      </div>
    </div>
  );
}
