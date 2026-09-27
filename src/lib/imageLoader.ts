// Images in /public are already sized WebP: serve each file once (one URL for every srcset width).
export default function imageLoader({ src }: { src: string; width: number }) {
  if (/^https?:\/\//.test(src)) return src;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${src}`;
}
