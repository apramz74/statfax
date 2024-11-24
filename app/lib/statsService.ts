import { createNBAApiClient } from "./nbaApi";
import {
  QueryComponents,
  GameStats,
  QueryParams,
  PlayerStats,
} from "@/app/types/index";
import { PlayerNotFoundError, APIRateLimitError } from "@/app/lib/nbaApi";

interface GameDetail {
  date: string;
  homeTeam: string;
  awayTeam: string;
}

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
      case "blocks":
        return playerStats.blocks;
      case "steals":
        return playerStats.steals;
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
          tpm: number;
          blocks: number;
          steals: number;
          min: string;
        }>;
      }>(endpoint);

      console.log("Got player stats response");

      // Collect all game IDs
      const gameIds = data.response.map((game) => game.game.id);

      // Get game details in batches
      const gameDetails = await this.fetchGameDetailsInBatches(gameIds);

      // Merge stats with game details
      return data.response.map((game) => ({
        gameId: game.game.id,
        date: gameDetails[game.game.id]?.date || "",
        homeTeam: gameDetails[game.game.id]?.homeTeam || "",
        awayTeam: gameDetails[game.game.id]?.awayTeam || "",
        playerStats: {
          points: game.points,
          rebounds: game.totReb,
          assists: game.assists,
          threePointers: game.tpm,
          blocks: game.blocks,
          steals: game.steals,
        },
      }));
    } catch (error) {
      console.error("Error getting player game stats:", error);
      throw error;
    }
  }

  private async fetchGameDetailsInBatches(
    gameIds: string[]
  ): Promise<Record<string, GameDetail>> {
    const BATCH_SIZE = 3;
    const gameDetails: Record<string, GameDetail> = {};
    const DELAY_BETWEEN_REQUESTS = 6000;
    const DELAY_BETWEEN_BATCHES = 12000;
    const RATE_LIMIT_DELAY = 60000;

    // Split gameIds into batches
    for (let i = 0; i < gameIds.length; i += BATCH_SIZE) {
      const batch = gameIds.slice(i, i + BATCH_SIZE);

      console.log(
        `Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
          gameIds.length / BATCH_SIZE
        )}`
      );

      // Process games sequentially within batch
      for (const gameId of batch) {
        try {
          const result = await this.apiClient.get<{
            response: Array<{
              date: { start: string };
              teams: {
                home: { name: string };
                visitors: { name: string };
              };
            }>;
          }>(`/games?id=${gameId}`);

          const game = result.response[0];
          if (game) {
            gameDetails[gameId] = {
              date: new Date(game.date.start).toISOString(),
              homeTeam: game.teams.home.name,
              awayTeam: game.teams.visitors.name,
            };
          }

          // Wait between individual requests
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_REQUESTS)
          );
        } catch (error) {
          if (error instanceof APIRateLimitError) {
            console.log("Rate limit hit, pausing for 1 minute...");
            await new Promise((resolve) =>
              setTimeout(resolve, RATE_LIMIT_DELAY)
            );
            i -= BATCH_SIZE; // Retry this batch
            break; // Exit the inner loop to retry the whole batch
          }
          console.error(`Error processing game ${gameId}:`, error);
        }
      }

      // Add longer delay between batches
      if (i + BATCH_SIZE < gameIds.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }
    }

    return gameDetails;
  }

  private buildQueryParams(query: QueryComponents): QueryParams {
    return {
      season: query.timeframe?.value || "2024",
    };
  }
}
