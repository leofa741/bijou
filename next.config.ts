import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  sw: '/sw.js',
  scope: '/',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // ✅ ELIMINADO: output: 'standalone' (No es necesario en Vercel y causa conflictos)

  // ✅ AGREGADAS: Las 3 librerías que tu NextAuth usa y que Vercel no debe empaquetar
  serverExternalPackages: ['jsonwebtoken', 'bcryptjs', 'nodemailer'],

  outputFileTracingIncludes: {
    '/*': [
      './node_modules/pdfkit/js/standard-fonts/**/*',
      './node_modules/pdfkit/js/data/**/*',
    ],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default withPWA(nextConfig);