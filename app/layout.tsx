import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://imkon-ai.vercel.app'),
  title: { default: 'Imkon — Sizga mos imkoniyatlar', template: '%s · Imkon' },
  description: 'O‘zbekiston yoshlari uchun ish, stajirovka, grant va bepul kurslarni bir joydan toping.',
  applicationName: 'Imkon',
  manifest: '/manifest.webmanifest',
  openGraph: { title: 'Imkon — Sizga mos imkoniyatlar', description: 'Yaxshi imkoniyatni qidirib vaqt yo‘qotmang.', type: 'website', locale: 'uz_UZ' },
  twitter: { card: 'summary_large_image', title: 'Imkon — Sizga mos imkoniyatlar', description: 'Ish, stajirovka, grant va bepul kurslarni bir joyda toping.' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#0f1715', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}
