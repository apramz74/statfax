import { QueryAnalyzer } from "@/app/lib/queryAnalyzer";
import { StatsService } from "@/app/lib/statsService";
import { QueryComponents } from "@/app/types/index";
import {
  APIError,
  PlayerNotFoundError,
  APIRateLimitError,
} from "@/app/lib/nbaApi";

export async function POST(request: Request) {
  try {
    const { parsedQuery } = (await request.json()) as {
      parsedQuery: QueryComponents;
    };

    if (!parsedQuery) {
      return Response.json(
        { error: "Missing parsed query in request body" },
        { status: 400 }
      );
    }

    const statsService = new StatsService();
    const queryAnalyzer = new QueryAnalyzer();

    const stats = await statsService.getStatsForQuery(parsedQuery);
    const analysis = queryAnalyzer.analyze(stats, parsedQuery);
    console.log("Analysis:", analysis);
    return Response.json(analysis);
  } catch (error) {
    console.error("Error fetching player stats:", error);

    if (error instanceof PlayerNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof APIRateLimitError) {
      return Response.json(
        { error: "API rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }
    if (error instanceof APIError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
