'use client';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  hours?: number;
  label?: string;
}

export default function CountdownTimer({
  hours = 24,
  label = "العرض ينتهي خلال"
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: hours,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const getEndTime = () => {
      const stored = localStorage.getItem('offer-end-time');
      if (stored) {
        return parseInt(stored);
      }
      const endTime = Date.now() + hours * 60 * 60 * 1000;
      localStorage.setItem('offer-end-time', endTime.toString());
      return endTime;
    };

    const interval = setInterval(() => {
      const diff = getEndTime() - Date.now();
      if (diff <= 0) {
        // Reset after 24 hours
        const newEnd = Date.now() + hours * 60 * 60 * 1000;
        localStorage.setItem('offer-end-time', newEnd.toString());
        setTimeLeft({ hours, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hours]);

  return (
    <div className="bg-red-600 text-white py-3 px-4 text-center font-bold">
      <p className="text-sm mb-1">{label}</p>
      <div className="flex justify-center gap-4 text-2xl font-mono">
        <div>
          <span className="bg-black px-3 py-1 rounded">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-xs mr-1">ساعة</span>
        </div>
        <div>
          <span className="bg-black px-3 py-1 rounded">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs mr-1">دقيقة</span>
        </div>
        <div>
          <span className="bg-black px-3 py-1 rounded">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs mr-1">ثانية</span>
        </div>
      </div>
    </div>
  );
}
