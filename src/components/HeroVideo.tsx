import React from 'react';

export default function HeroVideo() {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      poster="/images/video-poster.webp"
      className="w-full max-w-2xl rounded-lg shadow-2xl mx-auto"
    >
      <source src="/videos/hero-intro.webm" type="video/webm" />
      <source src="/videos/hero-intro.mp4" type="video/mp4" />
    </video>
  );
}
