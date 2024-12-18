'use client';

import { useEventStore } from '@/store/eventStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InputText() {
  const router = useRouter();
  const { setInputText, setGptText } = useEventStore();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1초

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 텍스트가 비어있는 경우 체크
    if (!text.trim()) {
      setError('내용을 입력해 주세요');
      return;
    }

    if (text.length > 300) {
      setError('300자까지만 입력할 수 있어요');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // 사용자 입력 텍스트 저장
    setInputText(text);

    let retries = 0;
    
    while (retries < MAX_RETRIES) {
      try {
        const response = await fetch('/api/gpt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userInput: text }),
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setGptText(data.result);
        router.push('/result');
        return;

      } catch (error) {
        console.error(`시도 ${retries + 1} 실패:`, error);
        retries++;
        
        if (retries === MAX_RETRIES) {
          setError('메시지 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        } else {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    setIsLoading(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (newText.trim()) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4" style={{ backgroundColor: '#D52121' }}>
      <button
        onClick={() => router.back()}
        className="text-2xl text-white hover:text-gray-200 transition mb-8 w-fit"
      >
        &#10094;
      </button>
      
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-tmon font-extrabold text-center mb-8 text-white">
            소중한 사람에게 하고 싶은 말을 간단히 적어주세요
          </h2>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="w-full mb-2">
              <textarea
                name="text"
                value={text}
                onChange={handleTextChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
                className="w-full p-6 min-h-[300px] resize-none rounded-lg border border-gray-200 
                          shadow-lg bg-white focus:ring-2 focus:ring-white focus:border-transparent
                          transition-all duration-200 font-pretendard font-normal"
                placeholder="메시지를 입력해주세요"
                disabled={isLoading}
                style={{
                  lineHeight: '1.8',
                }}
              />
              <div className="text-right mt-2 text-white font-pretendard font-normal text-sm">
                {text.length}/300
              </div>
            </div>
            {error && (
              <p className="text-white mb-4 font-pretendard font-normal">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-lg transition-colors duration-200 shadow-md font-pretendard font-normal
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-white text-[#D52121] hover:bg-gray-100'}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mr-2"></div>
                  열심히 편지 쓰는 중...
                </div>
              ) : (
                '편지 완성하기'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}