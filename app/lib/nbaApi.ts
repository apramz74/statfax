import { GameStats, QueryParams, NBAApiGameResponse } from "../types/index";

interface NBAApiConfig {
  apiKey: string;
  baseUrl: string;
}

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "APIError";
  }
}

export class APIRateLimitError extends APIError {
  constructor() {
    super("API rate limit exceeded");
    this.name = "APIRateLimitError";
  }
}

export class PlayerNotFoundError extends APIError {
  constructor(playerId: string) {
    super(`Player ${playerId} not found`);
    this.name = "PlayerNotFoundError";
  }
}

export const createNBAApiClient = (config: NBAApiConfig) => {
  const makeRequest = async (endpoint: string): Promise<Response> => {
    return fetch(`${config.baseUrl}${endpoint}`, {
      headers: {
        "X-RapidAPI-Key": config.apiKey,
        "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
      },
    });
  };

  return {
    async getPlayerGameStats(
      playerId: string,
      params: QueryParams
    ): Promise<GameStats[]> {
      const queryParams = new URLSearchParams({
        player_id: playerId,
        season: params.season || "2023-24",
        ...(params.startDate && { start_date: params.startDate }),
        ...(params.endDate && { end_date: params.endDate }),
      });

      const response = await makeRequest(
        `/games/playerStats?${queryParams.toString()}`
      );

      if (!response.ok) {
        if (response.status === 429) throw new APIRateLimitError();
        if (response.status === 404) throw new PlayerNotFoundError(playerId);
        throw new APIError(`API request failed: ${response.statusText}`);
      }

      const data = (await response.json()) as NBAApiGameResponse;

      // Transform API response to our GameStats format
      return data.response.map((game) => ({
        gameId: game.id,
        date: game.date,
        homeTeam: game.teams.home.name,
        awayTeam: game.teams.away.name,
        playerStats: {
          points: game.points,
          rebounds: game.totReb,
          assists: game.assists,
          threePointers: game.tpm,
        },
      }));
    },
  };
};
