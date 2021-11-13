/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["fakeimg.pl", "vietsale.sgp1.digitaloceanspaces.com"],
  },
  async rewrites() {
    return [
      {
        source: "/dev/:path*",
        destination: "http://157.245.61.181:8081/api/v1/:path*",
      },
    ];
  },
};
