import { createNBAApiClient } from "@/app/lib/nbaApi";
import { QueryComponents } from "@/app/types";

export async function POST(request: Request) {
  try {
    const { parsedQuery } = (await request.json()) as {
      parsedQuery: QueryComponents;
    };

    if (!parsedQuery.player) {
      return Response.json(
        { error: "Player information is required" },
        { status: 400 }
      );
    }

    const nbaClient = createNBAApiClient({
      apiKey: process.env.NBA_API_KEY!,
      baseUrl: process.env.NBA_API_BASE_URL!,
    });

    const gameStats = await nbaClient.getPlayerGameStats(
      parsedQuery.player.id,
      {}
    );

    return Response.json({ gameStats });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return Response.json(
      { error: "Failed to fetch player stats" },
      { status: 500 }
    );
  }
}
