import './globals.css';

export const metadata = {
  title: 'Mail OTP + Admin Panel',
  description: 'Email OTP auth with user admin panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}