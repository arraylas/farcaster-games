// pages/index.tsx
import { useEffect, useState } from 'react';

export default function Home() {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | null>(null);

  useEffect(() => {
    const storedDob = localStorage.getItem('dob');
    if (storedDob) {
      setDob(storedDob);
      setAge(calculateAge(storedDob));
    }
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dob', dob);
    setAge(calculateAge(dob));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Age Checker</h1>
      {!age ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="dob">Enter your date of birth:</label>
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
            style={{ display: 'block', margin: '1rem 0', padding: '0.5rem', width: '100%' }}
          />
          <button type="submit" style={{ padding: '0.5rem 1rem' }}>
            Save & Calculate Age
          </button>
        </form>
      ) : (
        <p>Your age: {age} years</p>
      )}
    </div>
  );
}
