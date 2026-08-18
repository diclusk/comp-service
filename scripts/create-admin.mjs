// Generate hash password buat admin baru, output-nya SQL siap-tempel ke
// Supabase SQL Editor. Password mentah TIDAK PERNAH dikirim/disimpan kemana pun
// selain di-hash lokal disini.
//
// Cara pakai:
//   node scripts/create-admin.mjs <username> <password>
//
// Contoh:
//   node scripts/create-admin.mjs tuna "password-kuat-banget"

import bcrypt from 'bcryptjs';

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error('Pakai: node scripts/create-admin.mjs <username> <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password minimal 8 karakter.');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log('\nJalankan SQL ini di Supabase SQL Editor:\n');
console.log(
  `insert into admins (username, password_hash) values ('${username.replace(/'/g, "''")}', '${hash}');`
);
console.log('\n(Kalau username sudah ada dan mau ganti password, pakai UPDATE + WHERE username alih-alih INSERT.)\n');
