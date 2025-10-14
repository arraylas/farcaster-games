// pages/index.tsx
import { useMiniApp } from '@farcaster/mini-app-sdk';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, isLoading } = useMiniApp();
  const router = useRouter();

  const handlePlayClick = () => {
    router.push('/oxox');
  };

  if (isLoading) {
    return (
      <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
        <p>Loading user info...</p>
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh'}}>
      {user ? (
        <>
          <h2>Welcome, {user.username}!</h2>
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
        <p>Please login with Farcaster to play.</p>
      )}
    </div>
  );
}
