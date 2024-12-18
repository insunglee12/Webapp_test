'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    // 클릭 핸들러 로직
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="relative w-full max-w-[800px] mx-auto">
        <Image
          src="/event_1_mainpage.png"
          alt="이벤트 메인 페이지"
          width={800}
          height={1000}
          className="w-full h-auto"
          priority
        />
        <div 
          onClick={handleClick}
          className={`
            absolute bottom-[4.6%] left-[10%] right-[10%] h-[6.4%] 
            cursor-pointer
            ${process.env.NODE_ENV === 'development' ? 
              'border-2 border-red-500 bg-red-500 bg-opacity-20' : 
              ''}
          `}
          aria-label="내 마음 전하러 가기"
        />
      </div>
    </main>
  );
}