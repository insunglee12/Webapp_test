"use client";

import { useEventStore } from "@/store/eventStore";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { domToCanvas } from 'modern-screenshot';

export default function Result() {
  const router = useRouter();
  const { selectedImage, inputText, gptText, setSelectedImage, setInputText } = useEventStore();
  const resultRef = useRef<HTMLDivElement>(null);

  const formatComment = (text: string) => {
    try {
      // gptText에서 텍스트 추출
      const commentMatch = text.match(/comment\s*:\s*([^}]+)/);
      const processedResponse = commentMatch 
        ? commentMatch[1].trim() 
        : text.trim();
      
      // 빈 응답 체크
      if (!processedResponse) {
        throw new Error('Empty processed response');
      }
      
      // 줄바꿈 처리
      return processedResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

    } catch (error) {
      console.error('Error processing gptText:', error);
      // 에러 발생 시 원본 텍스트에서 Step 부분 제거
      return text
        .replace(/Step \d+:?[^]*$/, '')
        .trim();
    }
  };

  const handleSaveImage = async () => {
    if (!resultRef.current) return;
    
    // iOS Safari 대응
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      try {
        // modern-screenshot을 사용하여 캡처
        const canvas = await domToCanvas(resultRef.current, {
          debug: true,
          scale: 2.5, // 해상도 증가
          quality: 1.0, // 최대 품질
          backgroundColor: null // 배경색 제거
        });
        
        // canvas 품질 설정
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
        const newTab = window.open('', '_blank');
        if (newTab) {
          newTab.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Holiday Card</title>
              </head>
              <body style="margin:0; padding:0; background:transparent;">
                <div style="display:flex; justify-content:center; align-items:center; min-height:100vh;">
                  <img src="${dataUrl}" style="width:100%; max-width:518px; height:auto; display:block; border:none;" />
                </div>
                <script>
                  window.onload = () => {
                    alert('이미지를 길게 누른 후 "이미지 저장"을 선택해주세요');
                  }
                </script>
              </body>
            </html>
          `);
          newTab.document.close();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      // 기존 다른 브라우저 대응 코드 유지
      try {
        const dataUrl = await htmlToImage.toPng(resultRef.current, {
          quality: 1.0,
          cacheBust: true,
        });
        
        const link = document.createElement('a');
        link.download = 'holiday-card.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error:', error);
        alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
      }
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
            top: "61%",
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
    {formatComment(gptText)}
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