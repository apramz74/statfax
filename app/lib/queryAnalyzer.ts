import { GameStats, QueryComponents, AnalysisResult } from "@/app/types/index";

export class QueryAnalyzer {
  analyze(stats: GameStats[], query: QueryComponents): AnalysisResult {
    const { statistic } = query;

    if (stats.length === 0) {
      return {
        summary: "No games found matching the criteria.",
        details: [],
      };
    }

    // Calculate basic statistics
    const category = statistic?.category?.toLowerCase() || "";
    const values = stats.map((game) => this.getStatValue(game, category));
    const average = this.calculateAverage(values);
    const gamesPlayed = stats.length;

    // Generate the analysis summary
    const summary = this.generateSummary(query, gamesPlayed, average);

    return {
      summary,
      details: stats,
    };
  }

  private getStatValue(game: GameStats, category: string): number {
    switch (category) {
      case "points":
        return game.playerStats.points;
      case "rebounds":
        return game.playerStats.rebounds;
      case "assists":
        return game.playerStats.assists;
      case "three pointers":
        return game.playerStats.threePointers;
      default:
        return 0;
    }
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private generateSummary(
    query: QueryComponents,
    gamesPlayed: number,
    average: number
  ): string {
    const category = query.statistic?.category?.toLowerCase() || "";
    const playerName = query.player?.name || "";

    if (query.condition) {
      const matchingGames = gamesPlayed;
      return `${playerName} had ${matchingGames} games where they recorded ${
        query.condition.operator
      } ${query.condition.threshold} ${category} in the ${
        query.timeframe?.value || "current"
      } season.`;
    }

    return `In the ${
      query.timeframe?.value || "current"
    } season, ${playerName} averaged ${average.toFixed(
      1
    )} ${category} over ${gamesPlayed} games.`;
  }
}
