"use client";

import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), {
  ssr: false, // Ensure this runs completely on the client side just like Vite!
});

export default function Home() {
  return <App />;
}
