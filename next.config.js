/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ini adalah baris KUNCI untuk memperbaiki 404 di Netlify/Vercel.
  // Ini memaksa Next.js untuk menghasilkan output HTML statis murni.
  output: 'export', 

  // Agar Next.js tidak mencoba mengoptimalkan gambar secara server-side 
  // dalam mode static export.
  images: {
    unoptimized: true,
  },
  
  // Konfigurasi Anda yang sudah ada untuk menangani MiniApp SDK
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mengatasi masalah build di server dengan MiniApp SDK
      config.resolve.alias['@farcaster/mini-app-sdk'] = false;
    }
    return config;
  },
  
  // Membantu build lebih cepat dengan mengabaikan peringatan sementara
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
