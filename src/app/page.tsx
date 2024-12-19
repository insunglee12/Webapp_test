'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/select-image');
  };

  return (
    <main className="h-screen w-full flex items-center justify-center bg-white overflow-x-hidden">
      <div 
        className="relative w-full h-full"
        onClick={handleClick}
      >
        <div className="relative w-full h-full">
          <Image
            src="/event_1_mainpage.png"
            alt="이벤트 메인 페이지"
            fill
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center',
              cursor: 'pointer',
              width: '100vw'
            }}
            priority
          />
        </div>
      </div>
    </main>
  );
}