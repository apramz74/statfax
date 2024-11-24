export interface QueryComponents {
  player?: {
    name: string;
    team: string;
  };
  statistic?: {
    category: string;
  };
  timeframe?: {
    value: string;
  };
  condition?: {
    operator: string;
    threshold: number;
  };
}

export interface PlayerStats {
  points: number;
  rebounds: number;
  assists: number;
  threePointers: number;
  blocks: number;
  steals: number;
}

export interface GameStats {
  date: string;
  homeTeam: string;
  awayTeam: string;
  playerStats: {
    points: number;
    rebounds: number;
    assists: number;
    threePointers: number;
    blocks: number;
    steals: number;
  };
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

export interface AnalysisResult {
  summary: string;
  details: GameStats[];
}
