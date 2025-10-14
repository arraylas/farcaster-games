/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (isServer) {
              // Jangan resolve Farcaster SDK di server
                    config.resolve.alias['@farcaster/mini-app-sdk'] = false;
                        }
                            return config;
                              },
                              };

                              module.exports = nextConfig;