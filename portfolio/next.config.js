module.exports = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { isrMemoryCacheSize: 0 },
  // Disable static generation — all pages are server-rendered
  // This fixes the React dual-instance issue on Windows case-insensitive filesystem
  generateBuildId: async () => 'build',
};
