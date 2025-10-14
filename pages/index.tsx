import type { NextPage } from 'next';
import Link from 'next/link';

// Basic inline styling
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
  color: '#635BFF',
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
      <h1 style={titleStyle}>Welcome to the Tictactoe MiniApp 🎮</h1>
      
      <p style={paragraphStyle}>
        This MiniApp features a challenging 5x5 XOXO game against the computer. See if you can get four in a row!
      </p>
      
      <h2>Ready to Play?</h2>
      
      <Link href="/oxox" style={linkStyle}>
        Start 5x5 Game
      </Link>

      <p style={{ marginTop: '50px', fontSize: '0.9em', color: '#888' }}>
        *Remember: four in a row wins!*
      </p>
    </div>
  );
};

export default IndexPage;
