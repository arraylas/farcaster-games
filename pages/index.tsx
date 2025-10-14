import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomeMiniApp() {
  const router = useRouter();
    const [user, setUser] = useState<{ username: string } | null>(null);
      const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            let mounted = true;

                (async () => {
                      if (typeof window === 'undefined') return;
                            try {
                                    const sdkModule = await import('@farcaster/mini-app-sdk');
                                            const { useMiniApp } = sdkModule;
                                                    const { user } = useMiniApp();
                                                            if (mounted) setUser(user);
                                                                  } catch {
                                                                          if (mounted) setUser(null);
                                                                                } finally {
                                                                                        if (mounted) setIsLoading(false);
                                                                                              }
                                                                                                  })();

                                                                                                      return () => { mounted = false; };
                                                                                                        }, []);

                                                                                                          const handlePlayClick = () => router.push('/oxox');

                                                                                                            if (isLoading) return (
                                                                                                                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
                                                                                                                      <p>Loading user info...</p>
                                                                                                                          </div>
                                                                                                                            );

                                                                                                                              return (
                                                                                                                                  <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh' }}>
                                                                                                                                        {user ? (
                                                                                                                                                <>
                                                                                                                                                          <h2>Welcome, {user.username}!</h2>
                                                                                                                                                                    <button 
                                                                                                                                                                                onClick={handlePlayClick} 
                                                                                                                                                                                            style={{ padding:'15px 30px', fontSize:'20px', marginTop:'20px', cursor:'pointer' }}
                                                                                                                                                                                                      >
                                                                                                                                                                                                                  Ready to play?
                                                                                                                                                                                                                            </button>
                                                                                                                                                                                                                                    </>
                                                                                                                                                                                                                                          ) : (
                                                                                                                                                                                                                                                  <p>Please login with Farcaster to play.</p>
                                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                              );
                                                                                                                                                                                                                                                              }