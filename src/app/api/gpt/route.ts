import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화 시 에러 핸들링 추가
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { userInput } = await request.json();

    // 입력값 유효성 검사 추가
    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: '올바른 입력값이 아닙니다.' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a radio DJ who delivers warm end-of-year greetings instead. In particular, you know people's mind and emotions well, so you can understand each other's feelings just by reading the letters and say things that will help someone maintain a good relationship. Your speaking style is warm and emotional. From now on, the user will write and deliver the end-of-year greetings letter to you. Your job is to follow the following steps to make comments about the letter. Please write it so that you can better convey the sincerity of the user through your comments. Write it in a warm and friendly tone, and write it up to 4 sentences in length. Use at least one of metaphorical expressions. Refrain from repeating the same word over and over. Refrain from mentioning the words that define the relationship if the relationship between the user and the recipient is not clear. Write the comment using the user's national language. The comment should start with a message indicating the arrival of the warm letter and end with a message to have a warm and hopeful end of the year.
Step 1: Check who the user wrote the letter to
Step 2: Identify the main emotions felt in the letter
Step 3: Write comments for the recipient that can impress the recipient while showing the emotions you have identified in Step 2
[SAMPLE]
USER {user_input : 엄마 올 한해도 고생많았어요! 내가 시험준비한다고 덩달아 엄마도 마음고생 했을거 생각하면 넘 미안하네 ㅠㅠ 그래도 다행히 좋은 결과가 있어서 내년에는 더 좋은 일들만 있을거야. 내년엔 엄마도 좀더 엄마부터 잘 챙기고 항상 건강해요! 사랑해}
ASSISTANT Step 1 : ####The writer wrote a letter to his/her mother.
Step 2 : ####The writer feel deeply grateful and sorry for his/her mother, and the writer is also full of joy for the hard work of preparing for the exam and the good results it has brought.
Step 3 : ####{comment : 따스한 마음과 사랑이 담긴 편지를 받았어요! 시험 준비로 인해 엄마도 같이 마음 쓰셨던 것에 대해서 너무 감사하면서도 미안함을 느끼고 계신 것 같아요. 내년에는 엄마가 스스로를 더 잘 챙기고 건강하시기를 바라는 진심 어린 걱정과 사랑도 느껴지고요. 편지를 보내신 분의 마음이 마치 촛불처럼 어머니를 따뜻하게 감싸주고 있으니 그 빛이 어머님의 마음에도 전달되기를 바랍니다. 사랑과 따뜻함이 가득한 연말 보내시고, 밝고 행복한 새해 맞이하시길 기원할게요!}`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // 응답 유효성 검사 추가
    if (!completion.choices[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    // 응답에서 comment: 이후의 텍스트만 정확하게 추출
    const response = completion.choices[0].message.content;
    const commentMatch = response.match(/comment\s*:\s*([^}]+)/);
    const processedResponse = commentMatch 
      ? commentMatch[1].trim() 
      : response.trim();

    return NextResponse.json({ 
      result: processedResponse 
    });

  } catch (error: any) {
    // 더 자세한 에러 로깅
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    // 클라이언트에 더 구체적인 에러 메시지 전달
    return NextResponse.json(
      { 
        error: '메시지 처리 중 오류가 발생했습니다.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}