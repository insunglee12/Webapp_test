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
    <div className="min-h-screen p-8" style={{ backgroundColor: '#D52121' }}>
      <button
        onClick={() => router.back()}
        className="text-2xl text-white hover:text-gray-200 transition mb-8 w-fit"
      >
        &#10094;
      </button>
      
      <h2 className="text-2xl font-tmon font-extrabold text-center mb-8 text-white">
        편지와 함께 보내고 싶은 이미지를 골라주세요
      </h2>
      <div className="grid grid-cols-3 gap-8 mb-8 max-w-2xl mx-auto">
        {images.map((image, index) => (
          <div
            key={index}
            className={`
              aspect-square rounded-full overflow-hidden cursor-pointer
              transition-all duration-200 transform hover:scale-105
              ${selectedIndex === index ? 'ring-4 ring-white ring-offset-4 ring-offset-[#D52121]' : ''}
            `}
            onClick={() => handleImageSelect(image, index)}
          >
            <Image
              src={image}
              alt={`선택 이미지 ${index + 1}`}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/input-text')}
          className="w-full bg-white text-[#D52121] px-6 py-3 rounded-lg hover:bg-gray-100 transition font-pretendard font-normal"
          disabled={selectedIndex === null}
        >
          선택완료
        </button>
      </div>
    </div>
  );
}