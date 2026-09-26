import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const UPLOAD_URL_PREFIX = "/uploads/";
export const UPLOAD_NAME_RE = /^[0-9a-f-]{36}\.(jpg|png|gif|webp|avif)$/;

export const uploadDir = () => process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
};

/** Detects the image type from magic bytes — the client-supplied MIME type is never trusted. */
export function detectImageType(buf: Uint8Array): keyof typeof MIME | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...buf.subarray(start, end));
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (ascii(0, 4) === "GIF8") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "avif";
  return null;
}

export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name}: larger than 5 MB`);
  const buf = new Uint8Array(await file.arrayBuffer());
  const ext = detectImageType(buf);
  if (!ext) throw new Error(`${file.name}: not a JPEG, PNG, GIF, WebP or AVIF image`);
  const name = `${randomUUID()}.${ext}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), name), buf);
  return UPLOAD_URL_PREFIX + name;
}

export async function readUpload(name: string) {
  if (!UPLOAD_NAME_RE.test(name)) return null;
  try {
    const data = await readFile(path.join(uploadDir(), name));
    return { data, type: MIME[name.split(".").pop()!] };
  } catch {
    return null;
  }
}

/** True for absolute http(s) URLs or files uploaded through the admin. */
export const isImageRef = (v: string) => /^https?:\/\/\S+$/.test(v) || (v.startsWith(UPLOAD_URL_PREFIX) && UPLOAD_NAME_RE.test(v.slice(UPLOAD_URL_PREFIX.length)));
