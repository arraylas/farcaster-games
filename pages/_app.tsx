// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        console.log('Farcaster context:', context);
        await sdk.actions.ready();
        console.log('MiniApp ready!');
      } catch (err) {
        console.error('Farcaster SDK init failed:', err);
      }
    };
    init();
  }, []);

  return <Component {...pageProps} />;
}
