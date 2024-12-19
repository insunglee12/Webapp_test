'use client';

import { useEventStore } from '@/store/eventStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function SelectImage() {
  const router = useRouter();
  const { setSelectedImage } = useEventStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const images = Array.from({ length: 9 }, (_, i) => `/component${i + 1}.png`);

  const handleImageSelect = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setSelectedIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#D52121]">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="text-2xl text-white hover:text-gray-200 transition mb-6"
        >
          ❮
        </button>
        
        <h2 className="text-xl font-tmon font-bold text-center mb-6 text-white">
          편지와 함께 보내고 싶은 이미지를 골라주세요
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square relative"
            >
              <button
                onClick={() => handleImageSelect(image, index)}
                className={`
                  w-full h-full rounded-full overflow-hidden
                  transition-transform duration-200 hover:scale-105 active:scale-95
                  ${selectedIndex === index ? 'ring-4 ring-white' : ''}
                `}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image}
                    alt={`선택 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 430px) 33vw, 120px"
                    priority={index < 6}
                  />
                </div>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => selectedIndex !== null && router.push('/input-text')}
          className={`
            w-full py-4 rounded-lg font-pretendard text-lg transition
            ${selectedIndex !== null 
              ? 'bg-white text-[#D52121] hover:bg-gray-100' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
        >
          선택완료
        </button>
      </div>
    </div>
  );
}