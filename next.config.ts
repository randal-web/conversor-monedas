import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com pagead2.googlesyndication.com partner.googleadservices.com tpc.googlesyndication.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: www.google-analytics.com www.googletagmanager.com pagead2.googlesyndication.com",
              "font-src 'self'",
              "connect-src 'self' open.er-api.com api.frankfurter.dev www.google-analytics.com www.googletagmanager.com pagead2.googlesyndication.com",
              "frame-src 'self' googleads.g.doubleclick.net tpc.googlesyndication.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
