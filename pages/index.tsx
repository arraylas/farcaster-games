import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Home() {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [fid, setFid] = useState<string | null>(null);

  // Ambil fid Farcaster user (jika user login di miniapp)
  useEffect(() => {
    const fetchFid = async () => {
      try {
        const user = await sdk.getProfile(); // Ambil profil user
        if (user?.fid) {
          setFid(user.fid);

          const storedDob = localStorage.getItem(`dob-${user.fid}`);
          if (storedDob) {
            setDob(storedDob);
            setAge(calculateAge(storedDob));
          }
        }
      } catch (err) {
        console.log('Tidak bisa ambil profile, user harus input DOB manual.', err);
      }
    };
    fetchFid();
  }, []);

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fid) return; // Pastikan ada fid untuk key localStorage
    localStorage.setItem(`dob-${fid}`, dob);
    setAge(calculateAge(dob));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h1>Cek Umur Farcaster</h1>

      {!age ? (
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
          <button type="submit">Simpan & Hitung Umur</button>
        </form>
      ) : (
        <p>Umur Anda: {age} tahun</p>
      )}
    </div>
  );
}
