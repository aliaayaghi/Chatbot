import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { history } = await request.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: history }), 
      }
    );

    const data = await response.json();

    // Handle API-level errors
    if (!response.ok) {
      console.log("Error:", data.error.message);
      return NextResponse.json(
        { error: data.error.message },
        { status: response.status }
      );
    }

    const reply = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ reply });

  } catch (error) {
    console.log("Server error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}