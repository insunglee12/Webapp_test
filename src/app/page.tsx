'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/select-image');
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-white overflow-y-auto overflow-x-hidden">
      <div 
        className="relative w-full h-auto"
        onClick={handleClick}
      >
        <div className="relative w-full" style={{ aspectRatio: '430/932' }}>
          <Image
            src="/event_1_mainpage.png"
            alt="이벤트 메인 페이지"
            fill
            style={{ 
              objectFit: 'contain',
              objectPosition: 'center',
              cursor: 'pointer',
              width: '100%'
            }}
            priority
          />
        </div>
      </div>
    </main>
  );
}