import { NextRequest, NextResponse } from 'next/server';

const CHAT_API_URL = process.env.CHAT_API_URL || 'https://credable-chatbot.onrender.com/chat';
const CHAT_API_KEY = process.env.CHAT_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(CHAT_API_KEY && { 'X-API-Key': CHAT_API_KEY }),
    };
    const res = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, history }),
    });
    const data = await res.json().catch(() => ({}));
    const reply =
      (typeof data === 'string' ? data : null) ||
      data?.response ||
      data?.reply ||
      data?.answer ||
      data?.message ||
      'Sorry, I couldn\'t get a response from the chatbot.';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: 'Chat service temporarily unavailable.' },
      { status: 502 }
    );
  }
}
