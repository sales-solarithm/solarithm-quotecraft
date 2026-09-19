import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../App'), { ssr: false });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Solarithm QuoteCraft</title>
      </Head>
      {!mounted ? (
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
          <div className="text-[#D4AF37] font-serif font-bold text-lg">Solarithm QuoteCraft</div>
        </div>
      ) : (
        <App />
      )}
    </>
  );
}
