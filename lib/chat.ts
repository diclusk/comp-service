// Konstanta & tipe yang dipakai bareng-bareng oleh client (ChatBot.tsx) dan
// server (app/api/chat/route.ts) — supaya batas giliran AI selalu sinkron.

export const MAX_AI_TURNS = 5;

export const HANDOFF_NOTICE =
  'Terima kasih sudah menjelaskan detailnya! 🙏 Untuk penanganan lebih lanjut, chat ini akan diteruskan ke tim CS kami — mereka akan segera membalas di sini.';

export type ChatSessionStatus = 'bot' | 'handed_off';
