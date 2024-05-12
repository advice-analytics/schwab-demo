import './globals.css'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Welcome',
  description: 'CommsAI Advisor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className='flex flex-col min-h-screen'>
      <Footer />
    </div>
      </body>
    </html>
  )
}