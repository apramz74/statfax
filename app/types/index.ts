export interface QueryComponents {
  player: {
    name: string;
    id: string;
    team?: string;
  };
  statistic: {
    category: string;
    subcategory?: string;
  };
  condition?: {
    operator: "over" | "under" | "exactly";
    threshold: number;
  };
  timeframe?: {
    type: "season" | "game" | "career";
    value?: string;
  };
}

export interface PlayerGameStats {
  points: number;
  rebounds: number;
  assists: number;
  threePointers: number;
}

export interface GameStats {
  gameId: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  playerStats: PlayerGameStats;
}

export interface QueryParams {
  season?: string;
  startDate?: string;
  endDate?: string;
}

// API Response types
export interface NBAApiGameResponse {
  response: {
    id: string;
    date: string;
    teams: {
      home: { name: string };
      away: { name: string };
    };
    points: number;
    totReb: number;
    assists: number;
    tpm: number;
  }[];
}
