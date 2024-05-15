import './globals.css'

import Loader from "@/components/common/Loader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import * as React from "react";

export const metadata = {
  title: 'Welcome',
  description: 'CommsAI Advisor',
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Loader />
        <Header />
        <main
          style={{
            maxHeight: 'calc(100vh - 8rem)',
            minHeight: 'calc(100vh - 8rem)'
          }}
          className={'overflow-y-auto mt-[4rem] relative'}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
