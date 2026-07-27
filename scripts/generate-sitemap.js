﻿// scripts/generate-sitemap.js

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://dankamf-eduplex.web.app";

const staticRoutes = [
  "/",
  "/services",
  "/academics",
  "/projects",
  "/student-life",
  "/gallery",
  "/blog",
  "/jobs",
  "/admissions/apply",
  "/admissions/interview",
  "/admissions/status",
  "/admissions/fees",
  "/calendar",
  "/downloads",
  "/alumni",
  "/book-a-tour",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/client-confidence",
  "/faqs",
];

const routeImages = {
  "/": [
    {
      loc: `${SITE_URL}/logo512.png`,
      title: "Dankamf Educational Complex Logo",
    },
  ],
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSitemapXml(routes) {
  const timestamp = new Date().toISOString();

  const urls = routes.map((route) => {
    const images = routeImages[route] || [];
    const imageXml = images
      .map(
        (image) => `
    <image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      <image:title>${escapeXml(image.title)}</image:title>
    </image:image>`
      )
      .join("");

    return `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.7"}</priority>${imageXml}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls.join("\n")}
</urlset>`;
}

async function generateSitemap() {
  try {
    const xml = generateSitemapXml(staticRoutes);

    const outputPath = path.join(__dirname, "../public/sitemap.xml");
    fs.writeFileSync(outputPath, xml);

    console.log("Sitemap generated with", staticRoutes.length, "routes.");
  } catch (err) {
    console.error("Error generating sitemap:", err);
    process.exitCode = 1;
  }
}

generateSitemap();
