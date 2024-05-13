import './globals.css'

import Loader from "@/components/common/Loader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import * as React from "react";

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
        <Loader />
        <div className='flex flex-col min-h-screen'>
          <div className='flex-grow'>
            <Header />
            <main className='flex flex-col max-w-7xl px-2 sm:px-4 lg:px-8 mx-auto my-0 py-4'>{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
