// Images in /public are already sized WebP, so serve them as-is under the base path.
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (/^https?:\/\//.test(src)) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${src}?w=${width}`;
}
