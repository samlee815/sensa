// Static export for GitHub Pages. On a project page (user.github.io/sensa) the workflow
// passes PAGES_BASE_PATH=/sensa; with a custom domain it is empty.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  // No image server on static hosting: a tiny loader just prefixes the base path.
  images: { loader: "custom", loaderFile: "./src/lib/imageLoader.ts" },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default nextConfig;
