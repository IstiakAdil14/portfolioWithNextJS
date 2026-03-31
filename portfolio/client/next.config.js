module.exports = {
  env: {
    JWT_ACCESS_SECRET:
      "5f1ebeeebb9a38f330f36d8c66b92b52aceb7c2f0e55f3362a52958ec347c68a",
    JWT_REFRESH_SECRET:
      "d33f652bc72f926799fe015b8b20805fdf50973301eccdb96ccefab95ad59f4",
  },
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
      },
      {
        source: "/api/contact",
        destination: "http://localhost:5000/api/contact",
      },
      {
        source: "/api/admin/:path*",
        destination: "http://localhost:5000/api/admin/:path*",
      },
    ];
  },
};
