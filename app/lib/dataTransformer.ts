import { QueryAnalyzer } from "./queryAnalyzer";
import { QueryComponents } from "@/app/types/index";
import { GameStats } from "@/app/types/index";

interface QueryResult {
  summary: string;
  details: {
    headers: string[];
    rows: GameStatsRow[];
  };
}

interface GameStatsRow {
  date: string;
  opponent: string;
  PTS: number;
  REB: number;
  AST: number;
  "3PT": number;
  BLK: number;
  STL: number;
}

export class DataTransformer {
  static transformGameStats(
    rawData: GameStats[],
    query: QueryComponents
  ): QueryResult {
    // Analyze the data according to query
    const analyzer = new QueryAnalyzer();
    const analysis = analyzer.analyze(rawData, query);
    // Transform matching games into table rows
    const rows = analysis.details.map((game: GameStats) => ({
      date: new Date(game.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      opponent:
        game.homeTeam === query.player?.team ? game.awayTeam : game.homeTeam,
      PTS: game.playerStats.points,
      REB: game.playerStats.rebounds,
      AST: game.playerStats.assists,
      "3PT": game.playerStats.threePointers,
      BLK: game.playerStats.blocks,
      STL: game.playerStats.steals,
    }));

    return {
      summary: analysis.summary,
      details: {
        headers: ["Date", "Opponent", "PTS", "REB", "AST", "3PT", "BLK", "STL"],
        rows,
      },
    };
  }
}
