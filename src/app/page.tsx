'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/select-image');
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="relative w-full max-w-[430px] mx-auto">
        <div className="relative w-full" style={{ paddingTop: '232.78%' }}>
          <Image
            src="/event_1_mainpage.png"
            alt="이벤트 메인 페이지"
            fill
            style={{ 
              objectFit: 'contain',
              objectPosition: 'top'
            }}
            priority
          />
          <div 
            onClick={handleClick}
            className={`
              absolute bottom-[4.8%] left-[10%] right-[10%] h-[7%] 
              cursor-pointer z-10
              ${process.env.NODE_ENV === 'development' ? 
                'border-2 border-red-500 bg-red-500 bg-opacity-20' : 
                ''}
            `}
            aria-label="내 마음 전하러 가기"
          />
        </div>
      </div>
    </main>
  );
}