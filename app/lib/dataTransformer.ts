import { QueryAnalyzer } from "./queryAnalyzer";
import { QueryComponents } from "../types";

interface QueryResult {
  summary: {
    value: number | string;
    description: string;
  };
  details: {
    headers: string[];
    rows: GameStatsRow[];
  };
}

interface GameStatsRow {
  date: string;
  opponent: string;
  points: number;
  rebounds: number;
  assists: number;
  threePointers: number;
  // other relevant stats
}

export class DataTransformer {
  static transformGameStats(
    rawData: GameStats[],
    query: QueryComponents
  ): QueryResult {
    // Analyze the data according to query
    const analysis = QueryAnalyzer.analyzeGames(rawData, query);

    // Transform matching games into table rows
    const rows = analysis.matches.map((game) => ({
      date: new Date(game.date).toLocaleDateString(),
      opponent:
        game.homeTeam === query.player?.team ? game.awayTeam : game.homeTeam,
      ...game.playerStats,
    }));

    return {
      summary: analysis.summary,
      details: {
        headers: ["Date", "Opponent", "Points", "Rebounds", "Assists", "3PM"],
        rows,
      },
    };
  }

  static transformSeasonStats(
    rawData: SeasonStats,
    queryType: string
  ): QueryResult {
    // Transform season statistics
  }
}
