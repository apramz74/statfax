import { GoogleGenerativeAI } from "@google/generative-ai";
import { QueryComponents } from "../types";
import { QUERY_PARSER_PROMPT } from "./prompts";

export async function parseQueryWithAI(
  query: string,
  apiKey: string
): Promise<QueryComponents> {
  try {
    // Initialize the Google AI client with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content with the full prompt
    const result = await model.generateContent(
      QUERY_PARSER_PROMPT + "\n\n" + query
    );
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const parsed: QueryComponents = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("Error parsing query:", error);
    throw new Error("Failed to parse query");
  }
}
