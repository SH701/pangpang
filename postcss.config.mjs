import { tailwindcss } from '@tailwindcss/postcss';
import { nextPWA } from 'next-pwa';

export default {
  plugins: [
    tailwindcss,
    nextPWA({
      dest: 'public',
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === 'development',
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'offlineCache',
            expiration: {
              maxEntries: 200,
            },
          },
        },
      ],
    }),
  ],
};
