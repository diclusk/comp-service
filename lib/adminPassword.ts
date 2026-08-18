import bcrypt from 'bcryptjs';

// Dipisah dari lib/adminAuth.ts sengaja — file ini pakai bcryptjs (butuh Node
// runtime), sedangkan adminAuth.ts di-import juga oleh proxy.ts yang jalan di
// Edge runtime. Jangan import file ini dari proxy.ts.

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
