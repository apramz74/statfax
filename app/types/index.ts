export interface QueryComponents {
  player?: {
    name: string;
  };
  statistic?: {
    category: string;
  };
  timeframe?: {
    value: string;
  };
  condition?: {
    operator: string;
    value: number;
  };
}

export interface PlayerStats {
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
  playerStats: PlayerStats;
}

export interface QueryParams {
  season?: string;
  startDate?: string;
  endDate?: string;
}

export interface NBAApiGameResponse {
  response: Array<{
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
  }>;
}
