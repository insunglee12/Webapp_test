'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  const handleClick = (e: React.MouseEvent) => {
    if (isLoading) return;
    
    // 물결 효과 위치 계산
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true
    });
    
    setIsLoading(true);
    router.push('/select-image');
  };

  return (
    <main 
      onClick={handleClick}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#B70606' }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {/* 이미지 로딩 방식 수정 */}
        <div className="relative w-full max-w-[518px] aspect-[518/800]">
          <Image
            src="/event_mainpage.png"
            alt="메인 이미지"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 518px) 100vw, 518px"
          />
        </div>
        
        {/* 물결 효과 */}
        {ripple.show && (
          <div 
            className="absolute animate-ripple rounded-full bg-white/30"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="absolute top-5 right-5 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    </main>
  );
}