import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '이벤트 페이지',
  description: '이벤트 참여 페이지입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-pretendard">
        {children}
      </body>
    </html>
  )
}