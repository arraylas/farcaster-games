import type { NextPage } from 'next';
import Link from 'next/link';

// Basic inline styling for a clean, Farcaster-themed landing page
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f9f9f9',
};

const titleStyle: React.CSSProperties = {
  color: '#635BFF', // Farcaster-like purple/blue
  marginBottom: '10px',
};

const paragraphStyle: React.CSSProperties = {
  maxWidth: '600px',
  margin: '10px 0 30px 0',
  fontSize: '1.1em',
  color: '#333',
};

const linkStyle: React.CSSProperties = {
  padding: '12px 25px',
  fontSize: '1.2em',
  backgroundColor: '#635BFF', 
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s',
};

const IndexPage: NextPage = () => {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to the Farcaster Achievement MiniApp 🏅</h1>
      
      <p style={paragraphStyle}>
        This is the landing page for your MiniApp. The Farcaster SDK has been initialized in 
        `_app.tsx` and is ready to use for connecting user context or achievements.
      </p>
      
      <h2>Ready to Play?</h2>
      
      {/* Button linking to the XOXO 9x9 game page */}
      <Link href="/oxox" style={linkStyle}>
        Start XOXO 9x9 Game 🎮
      </Link>

      <p style={{ marginTop: '50px', fontSize: '0.9em', color: '#888' }}>
        *Check your browser console for the Farcaster SDK initialization status.*
      </p>
    </div>
  );
};

export default IndexPage;
