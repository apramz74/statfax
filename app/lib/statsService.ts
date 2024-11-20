import { createNBAApiClient } from "./nbaApi";
import {
  QueryComponents,
  GameStats,
  QueryParams,
  PlayerStats,
} from "@/app/types/index";
import { PlayerNotFoundError } from "@/app/lib/nbaApi";

export class StatsService {
  //Defines a private variable that contains the API client
  private apiClient;

  constructor() {
    if (!process.env.NBA_API_KEY || !process.env.NBA_API_BASE_URL) {
      throw new Error("Missing NBA API configuration");
    }

    this.apiClient = createNBAApiClient({
      apiKey: process.env.NBA_API_KEY,
      baseUrl: process.env.NBA_API_BASE_URL,
    });
  }

  async getStatsForQuery(query: QueryComponents): Promise<GameStats[]> {
    if (!query.statistic?.category) {
      throw new Error("Statistic category is required");
    }

    if (!query.player?.name) {
      throw new Error("Player name is required");
    }

    const playerId = await this.lookupPlayerId(query.player.name);
    if (!playerId) {
      throw new PlayerNotFoundError(query.player.name);
    }

    const params = this.buildQueryParams(query);
    const stats = await this.getPlayerGameStats(playerId, params);

    if (query.condition) {
      return this.filterStatsByCondition(
        stats,
        query.statistic.category,
        query.condition
      );
    }

    return stats;
  }

  private filterStatsByCondition(
    stats: GameStats[],
    category: string,
    condition: { operator: string; threshold: number }
  ): GameStats[] {
    return stats.filter((game) => {
      const statValue = this.getStatValue(game.playerStats, category);
      switch (condition.operator) {
        case ">":
          return statValue > condition.threshold;
        case "<":
          return statValue < condition.threshold;
        case "=":
          return statValue === condition.threshold;
        default:
          return true;
      }
    });
  }

  private getStatValue(playerStats: PlayerStats, category: string): number {
    switch (category.toLowerCase()) {
      case "points":
        return playerStats.points;
      case "rebounds":
        return playerStats.rebounds;
      case "assists":
        return playerStats.assists;
      case "three pointers":
        return playerStats.threePointers;
      default:
        throw new Error(`Unsupported statistic category: ${category}`);
    }
  }

  // Add new private method to lookup player ID
  private async lookupPlayerId(playerName: string): Promise<string | null> {
    try {
      console.log("Looking up player:", playerName);

      // Split the full name and get the last name
      const nameParts = playerName.split(" ");
      const lastName = nameParts[nameParts.length - 1];

      // Search using only the last name
      const queryParams = new URLSearchParams({
        search: lastName,
      }).toString();

      const endpoint = `/players?${queryParams}`;
      console.log("API endpoint:", endpoint);

      const data = await this.apiClient.get<{
        response: Array<{ id: string; firstname: string; lastname: string }>;
      }>(endpoint);

      console.log("API response:", data);

      // Find the player with matching full name
      const player = data.response.find((p) => {
        const fullName = `${p.firstname} ${p.lastname}`.toLowerCase();
        return fullName === playerName.toLowerCase();
      });

      if (!player) {
        throw new PlayerNotFoundError(playerName);
      }
      console.log(
        "Player found:",
        player.firstname,
        player.lastname,
        player.id
      );
      return player.id;
    } catch (error) {
      console.error("Error looking up player:", error);
      throw error;
    }
  }

  //Defines a private method that fetches the game stats for a player
  private async getPlayerGameStats(
    playerId: string,
    params: QueryParams
  ): Promise<GameStats[]> {
    try {
      console.log("Getting stats for player:", playerId);

      const queryParams = new URLSearchParams({
        id: playerId,
        season: params.season || "2024",
      });

      const endpoint = `/players/statistics?${queryParams.toString()}`;
      console.log("API endpoint:", endpoint);

      const data = await this.apiClient.get<{
        response: Array<{
          player: {
            id: string;
            firstname: string;
            lastname: string;
          };
          team: {
            id: string;
            name: string;
            nickname: string;
            code: string;
          };
          game: {
            id: string;
          };
          points: number;
          totReb: number;
          assists: number;
          tpm: number; // three pointers made
          min: string;
        }>;
      }>(endpoint);

      console.log("Got player stats response");

      return data.response.map((game) => ({
        gameId: game.game.id,
        date: "", // We'll need a separate call to get game details if we need the date
        homeTeam: "", // Same for team details
        awayTeam: "", // Same for team details
        playerStats: {
          points: game.points,
          rebounds: game.totReb,
          assists: game.assists,
          threePointers: game.tpm,
        },
      }));
    } catch (error) {
      console.error("Error getting player game stats:", error);
      throw error;
    }
  }

  private buildQueryParams(query: QueryComponents): QueryParams {
    return {
      season: query.timeframe?.value || "2024",
    };
  }
}
