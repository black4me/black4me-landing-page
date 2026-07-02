"use client";

import React, { useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
      {/* TODO: ارفع الفيديو في public/videos/hero-intro.mp4 و hero-intro.webm بعد التصوير مع جاسم */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={siteSettings?.video_poster || "/images/video-poster.webp"}
        className="w-full rounded-2xl"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/videos/hero-intro.webm" type="video/webm" />
        <source src="/videos/hero-intro.mp4" type="video/mp4" />
        {/* Fallback if no video uploaded yet */}
        متصفحك لا يدعم تشغيل الفيديو.
      </video>

      {/* Play overlay — shown when video hasn't started */}
      {!playing && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 cursor-pointer"
          onClick={handlePlay}
        >
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-black fill-black mr-[-2px]" />
          </div>
          <p className="text-white font-bold mt-4 text-sm">شاهد الفيديو التعريفي (60 ثانية)</p>
        </div>
      )}

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 left-4 p-2 bg-black/60 hover:bg-black/80 rounded-full transition text-white"
        aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Duration badge */}
      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
        60 ثانية
      </div>
    </div>
  );
}
