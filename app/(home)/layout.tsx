import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import TopBar from '@/components/Globals/TopBar'
import AuthProvider from '@/lib/SessionProvider'
import { getServerSession } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'T-ASK',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <main className='w-full h-full'>
            <TopBar />
            <section className='mt-14'>
              {children}
            </section>
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
