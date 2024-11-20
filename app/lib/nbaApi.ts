import { NBAApiGameResponse } from "@/app/types/index";

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
  return {
    async getGame(gameId: string): Promise<NBAApiGameResponse> {
      return this.get<NBAApiGameResponse>(`/games/${gameId}`);
    },

    async get<T>(endpoint: string): Promise<T> {
      try {
        const response = await fetch(`${config.baseUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": config.apiKey,
            "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("API Response:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          });

          if (response.status === 403) {
            throw new APIError(
              "API authentication failed. Please check your API key."
            );
          }
          if (response.status === 429) throw new APIRateLimitError();
          if (response.status === 404) throw new PlayerNotFoundError("Unknown");

          throw new APIError(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("NBA API request failed:", error);
        throw error;
      }
    },
  };
};
