import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const { userInput } = await req.json();

    if (!userInput) {
      return NextResponse.json(
        { error: "입력 텍스트가 없습니다." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "당신은 따뜻한 메시지를 작성하는 전문가입니다."
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices[0].message.content;

    if (!result) {
      throw new Error("GPT 응답이 비어있습니다.");
    }

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: error.message || "메시지 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
