const MAX_DIMENSION = 1600; // px, sisi terpanjang
const TARGET_MAX_BYTES = 1.5 * 1024 * 1024; // target ~1.5MB hasil kompres

/**
 * Compress file gambar di browser pakai canvas: resize ke max 1600px sisi
 * terpanjang, lalu turunkan quality JPEG bertahap sampai di bawah target size.
 * Selalu balikin File baru (bukan mutate yang asli).
 */
export async function compressImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);

  let { width, height } = bitmap;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  let quality = 0.85;
  let blob = await canvasToBlob(canvas, quality);

  while (blob && blob.size > TARGET_MAX_BYTES && quality > 0.4) {
    quality -= 0.15;
    blob = await canvasToBlob(canvas, quality);
  }

  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}
