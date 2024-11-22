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
    const analysis = QueryAnalyzer.analyzeGames(rawData, query);

    // Transform matching games into table rows
    const rows = analysis.matches.map((game) => ({
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

  static transformSeasonStats(
    rawData: SeasonStats,
    queryType: string
  ): QueryResult {
    // Transform season statistics
  }
}
