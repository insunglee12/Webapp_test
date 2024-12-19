"use client";

import { useEventStore } from "@/store/eventStore";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";

export default function Result() {
  const router = useRouter();
  const { selectedImage, inputText, gptText, setSelectedImage, setInputText } =
    useEventStore();
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    
    try {
      // 모바일 디바이스 체크
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      const options = {
        quality: 1.0,
        pixelRatio: 3,
        cacheBust: true,
        // 모바일 최적화 옵션
        skipAutoScale: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${resultRef.current.offsetWidth}px`,
          height: `${resultRef.current.offsetHeight}px`,
        },
      };

      const dataUrl = await htmlToImage.toPng(resultRef.current, options);

      if (isMobile) {
        // iOS Safari 대응
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          const newTab = window.open();
          if (newTab) {
            newTab.document.write(`
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Holiday Card</title>
                </head>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#ffffff;">
                  <img src="${dataUrl}" style="max-width:100%; height:auto;" alt="holiday card" />
                </body>
              </html>
            `);
            alert('이미지를 길게 누른 후 "이미지 저장"을 선택해주세요');
          }
        } else {
          // 기존 Android 등 다른 모바일 기기 처리
          const img = document.createElement('img');
          img.src = dataUrl;
          
          const newWindow = window.open('');
          if (newWindow) {
            newWindow.document.write(img.outerHTML);
            alert('이미지를 눌러서 저장해주세요');
          }
        }
      } else {
        // PC용 저장 방식
        const link = document.createElement('a');
        link.download = 'holiday-card.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Error:', err);
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setInputText("");
    router.push("/");
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center" style={{ backgroundColor: '#B70606' }}>
      <h2 className="text-2xl font-tmon font-extrabold text-center mb-8 text-white whitespace-pre-wrap">
        나만의 편지가 완성되었어요!{"\n"}이미지를 저장해서 소중한 사람에게 보내보세요
      </h2>

      {/* 캡처될 이미지 영역 */}
      <div
        ref={resultRef}
        className="relative w-full max-w-[518px]"
        style={{
          aspectRatio: "518/800",
          padding: 0,
          margin: "0 auto",
          backgroundColor: "transparent",
          overflow: "hidden"
        }}
      >
        {/* 배경 이미지 */}
        <img
          src="/event_resultpage.png"
          alt="postcard"
          className="object-contain absolute w-full h-full"
          style={{
            maxWidth: "100%",  // 추가: 이미지가 컨테이너를 벗어나지 않도록 제한
            maxHeight: "100%"  // 추가: 이미지가 컨테이너를 벗어나지 않도록 제한
          }}
        />

        {/* 선택된 이미지 */}
        {selectedImage && (
          <div
            className="absolute"
            style={{
              left: "43%",
              top: "5%",
              width: "14%",
              height: "14%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedImage}
              alt="선택한 이미지"
              className="w-full h-full object-contain"
            />
          </div>
        )}
          {/* 원본 텍스트 영역 */}
          <div
          className="absolute font-pretendard font-light"
          style={{
            left: "15%",
            top: "35%",
            width: "70%",
            height: "21%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",  // center에서 flex-start로 변경
            justifyContent: "flex-start",
            textAlign: "left",         
            lineHeight: "1.5",
            letterSpacing: "0.015em",
            wordBreak: "break-all",
    fontSize: "10px",  // 폰트 크기 추가
          }}
        >
           <div 
    className="w-full" 
    style={{
      textAlign: "left",
      display: "flex",
      justifyContent: "flex-start", // 추가
      alignItems: "flex-start"      // 추가
    }}
  >
    {inputText}
  </div>
        </div>

        {/* gpt 텍스트 영역 */}
        <div
          className="absolute font-pretendard font-light"
          style={{
            left: "15%",
            top: "65%",
            width: "70%",
            height: "17%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",  // center에서 flex-start로 변경
            justifyContent: "flex-start",
            textAlign: "left",      
            lineHeight: "1.5",
            letterSpacing: "0.015em",
            wordBreak: "break-all",
            fontSize: "10px",  // 폰트 크기 추가
          }}
        >
          <div 
    className="w-full" 
    style={{
      textAlign: "left",
      display: "flex",
      justifyContent: "flex-start", // 추가
      alignItems: "flex-start"      // 추가
    }}
  >
    {gptText}
  </div>
        </div>
      
      </div>

      <div className="w-full max-w-md mt-8 flex flex-col items-center">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex gap-4 justify-center">
            <button
              onClick={handleReset}
              className="flex-1 bg-white text-[#D52121] px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md font-pretendard font-normal"
            >
              처음으로
            </button>
            <button
              onClick={handleSaveImage}
              className="flex-1 bg-white text-[#D52121] px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-md font-pretendard font-normal"
            >
              이미지 저장
            </button>
          </div>
          <button
            onClick={() => window.location.href = 'https://smore.im/form/NupaxNLx4n'}
            className="w-full bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition shadow-md font-pretendard font-normal"
          >
            이벤트 응모하기
          </button>
        </div>
      </div>
    </div>
  );
}