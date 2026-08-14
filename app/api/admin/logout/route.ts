import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = '';
  const res = NextResponse.redirect(url);
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
