import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zencs.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/api/", "/my-bookings", "/booking/riwayat"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
