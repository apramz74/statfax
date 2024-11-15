"use client";
import { useState } from "react";

// Types for our parsed query
type StatCondition = {
  comparison: "over" | "under" | "exactly" | "average";
  value?: number;
};

type ParsedQuery = {
  player?: string;
  statType?: string;
  condition?: StatCondition;
  timeframe?: string;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryBreakdown, setQueryBreakdown] = useState<ParsedQuery | null>(
    null
  );

  // Basic parser function - we'll replace this with NLP later
  const parseQuery = (query: string): ParsedQuery => {
    // This is a very basic parser for demonstration
    const words = query.toLowerCase().split(" ");
    const parsed: ParsedQuery = {};

    // Look for common patterns
    if (words.includes("over")) {
      const index = words.indexOf("over");
      parsed.condition = {
        comparison: "over",
        value: Number(words[index + 1]),
      };
    }

    // Look for player names (very basic - will need improvement)
    const playerIndex = words.findIndex(
      (word) => word === "has" || word === "did" || word === "does"
    );
    if (playerIndex > 0) {
      parsed.player = words
        .slice(0, playerIndex)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Look for stat types
    const statTypes = [
      "points",
      "rebounds",
      "assists",
      "three-pointers",
      "threes",
    ];
    parsed.statType = statTypes.find((stat) => words.includes(stat));

    return parsed;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const breakdown = parseQuery(searchQuery);
    setQueryBreakdown(breakdown);
  };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto pt-20">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">NBA Stats Search</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask questions about NBA player stats in plain English
          </p>
        </div>

        {/* Search Container */}
        <div className="w-full">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 dark:border-gray-800 
                         bg-white dark:bg-black py-4 pl-12 pr-4 text-lg shadow-sm
                         placeholder:text-gray-400 dark:placeholder:text-gray-600
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask about player stats..."
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 
                             bg-blue-500 hover:bg-blue-600 text-white rounded-full 
                             px-6 py-2 text-sm font-medium transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Query Breakdown Section */}
          <div className="mt-12 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Query Breakdown</h2>
            {!queryBreakdown ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Enter a query above to see it broken down into components
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                {queryBreakdown.player && (
                  <div className="flex items-center">
                    <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium">
                      Player: {queryBreakdown.player}
                    </span>
                  </div>
                )}
                {queryBreakdown.statType && (
                  <div className="flex items-center">
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full text-sm font-medium">
                      Stat: {queryBreakdown.statType}
                    </span>
                  </div>
                )}
                {queryBreakdown.condition && (
                  <div className="flex items-center">
                    <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full text-sm font-medium">
                      Condition: {queryBreakdown.condition.comparison}{" "}
                      {queryBreakdown.condition.value}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Section (Empty State) */}
          <div className="mt-8 p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Results</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Your results will appear here
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
