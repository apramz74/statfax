import { NextResponse } from "next/server";
import { parseQueryWithAI } from "../../lib/queryParser";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      console.error("Missing API key");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const parsedQuery = await parseQueryWithAI(query, apiKey);
    return NextResponse.json({ parsedQuery });
  } catch (error) {
    console.error("Error in parse-query route:", error);
    return NextResponse.json(
      { error: "Failed to parse query" },
      { status: 500 }
    );
  }
}
