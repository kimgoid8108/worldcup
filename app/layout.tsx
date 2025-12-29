import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '2026 북중미 월드컵 경기장',
  description: '2026 북중미 월드컵 경기장 상세 정보',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
