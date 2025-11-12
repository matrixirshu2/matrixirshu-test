export const metadata = { title: 'OTP Login', description: 'Email OTP login with Admin panel' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
        {children}
      </body>
    </html>
  )
}
