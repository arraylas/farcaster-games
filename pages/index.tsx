// pages/index.tsx
import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Home() {
  const [fid, setFid] = useState<number | null>(null);
  const [accountAge, setAccountAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarcasterData = async () => {
      try {
        // ✅ Get the Farcaster context
        const context = await sdk.context;
        console.log('MiniApp Context:', context);

        if (!context?.user?.fid) {
          console.warn('FID not detected in context');
          setLoading(false);
          return;
        }

        const fidValue = context.user.fid;
        setFid(fidValue);

        // ✅ Load Neynar API key from .env
        const neynarApiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
        if (!neynarApiKey) throw new Error('Missing NEYNAR API key');

        // ✅ Fetch user data from Neynar API
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fidValue}`, {
          headers: {
            accept: 'application/json',
            api_key: neynarApiKey,
          },
        });

        const data = await response.json();
        console.log('Neynar Response:', data);

        const user = data?.users?.[0];
        if (user?.created_at) {
          const createdAt = new Date(user.created_at);
          const now = new Date();
          const diffYears = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
          setAccountAge(Math.floor(diffYears));
        }

      } catch (err) {
        console.error('Error fetching Farcaster data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarcasterData();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading Farcaster data...</p>;

  if (!fid) {
    return <p style={{ textAlign: 'center' }}>Could not detect FID. Please open this MiniApp inside Farcaster.</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Farcaster Account Age</h1>
      <p>FID: {fid}</p>
      {accountAge !== null ? (
        <p>Your account is about {accountAge} year(s) old 🎉</p>
      ) : (
        <p>Could not calculate account age.</p>
      )}
    </div>
  );
}
