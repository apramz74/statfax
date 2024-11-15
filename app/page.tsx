"use client";
import { useState } from "react";
import { QueryComponents } from "./types";
import { LoadingSpinner } from "./components/LoadingSpinner";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [queryBreakdown, setQueryBreakdown] = useState<QueryComponents | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/parse-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to parse query");
      }

      const { parsedQuery } = await response.json();
      setQueryBreakdown(parsedQuery);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setQueryBreakdown(null);
    } finally {
      setIsLoading(false);
    }
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
                             px-6 py-2 text-sm font-medium transition-colors
                             disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner />
                    Parsing...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </form>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

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
                  <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full text-sm font-medium">
                    Player: {queryBreakdown.player.name}
                  </span>
                )}
                {queryBreakdown.statistic && (
                  <span className="px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full text-sm font-medium">
                    Stat: {queryBreakdown.statistic.category}
                    {queryBreakdown.statistic.subcategory &&
                      ` (${queryBreakdown.statistic.subcategory})`}
                  </span>
                )}
                {queryBreakdown.condition && (
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full text-sm font-medium">
                    {queryBreakdown.condition.operator}{" "}
                    {queryBreakdown.condition.threshold}
                  </span>
                )}
                {queryBreakdown.aggregation && (
                  <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900 rounded-full text-sm font-medium">
                    {queryBreakdown.aggregation.type}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
