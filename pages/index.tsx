import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserFID } from '../utils/farcaster'; // sesuaikan utils repo kamu

export default function Home() {
  const [fid, setFID] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // contoh: detect FID dari wallet/session
    const userFID = getUserFID(); // harus disesuaikan dengan repo utils
    setFID(userFID);
  }, []);

  const handlePlayClick = () => {
    router.push('/oxox'); // redirect ke halaman OXOX
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      height:'100vh'
    }}>
      {fid ? (
        <>
          <h2>Welcome, {fid}!</h2>
          <button 
            onClick={handlePlayClick} 
            style={{
              padding:'15px 30px',
              fontSize:'20px',
              marginTop:'20px',
              cursor:'pointer'
            }}
          >
            Ready to play with me?
          </button>
        </>
      ) : (
        <p>Detecting your FID...</p>
      )}
    </div>
  );
}
