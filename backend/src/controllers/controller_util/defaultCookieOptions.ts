import { CookieOptions } from 'express';

export const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'none',
  secure: true
  // secure: true --- for ensuring it is only sent over https (for production)
};