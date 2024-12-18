'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full relative">
        <Image
          src="/event_1_mainpage.png"
          alt="이벤트 안내"
          width={1080}
          height={2252}
          className="w-full"
          priority
        />
        <div
          className="absolute cursor-pointer hover:bg-black/10"  // 검은색, 10% 투명도 호버 효과 추가
          style={{
            left: '8%',    
            bottom: '6%',  
            width: '80%',   
            height: '6.2%'
          }}
          onClick={() => router.push('/select-image')}
        />
      </div>
    </main>
  );
}