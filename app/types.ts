export type QueryComponents = {
  player: {
    name: string;
    id: string;
  } | null;
  statistic: {
    category: string;
    subcategory?: string; // e.g., "made" for "three pointers made"
  } | null;
  condition: {
    threshold: number;
    operator: ">" | "<" | "=" | ">=" | "<=";
  } | null;
  timeframe?: {
    type: "season" | "game" | "career";
    value?: string; // e.g., "2023-24" for season
  };
  aggregation?: {
    type: "count" | "average" | "total";
  };
};
