import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Imkon — Sizga mos imkoniyatlar',
  description: 'Ish, stajirovka, grant va bepul kurslarni bir joyda toping.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}