/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/_dev/:path*",
        destination: "http://157.245.61.181:8081/api/v1/:path*",
      },
      {
        source: "/_prod/:path*",
        destination: "http://157.245.156.225:8081/api/v1/:path*",
      },
    ];
  },
  reactStrictMode: true,
  images: {
    domains: ["fakeimg.pl"],
  },
};
