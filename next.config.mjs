/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Demo build — keep the CI-style build resilient so `npm run build`
  // never fails on lint-only issues during the presentation.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
