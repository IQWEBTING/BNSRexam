import type {Metadata} from 'next';
import { Sarabun } from 'next/font/google';
import './globals.css'; // Global styles

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
});

export const metadata: Metadata = {
  title: 'ระบบสอบออนไลน์',
  description: 'ระบบทำข้อสอบออนไลน์',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} font-sans antialiased bg-slate-100 text-slate-900`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
