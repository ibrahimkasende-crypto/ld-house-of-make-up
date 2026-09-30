import fs from "fs/promises";
import path from "path";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);

export async function saveImage(file: File, folder: string) {
  if (!file || file.size === 0) return null;
  const ext = ALLOWED.get(file.type);
  if (!ext) throw new Error("Format non accepté. Utilisez JPG, PNG, WEBP ou AVIF.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image trop lourde. Maximum 5 Mo.");
  const safeFolder = folder.replace(/[^a-z0-9-]/g, "");
  const filename = `${safeFolder}-${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${safeFolder}/${filename}`;
}
