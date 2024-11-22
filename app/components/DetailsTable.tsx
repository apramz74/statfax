import React from "react";

interface TableRow {
  Date: string;
  Opponent: string;
  PTS: number;
  REB: number;
  AST: number;
  "3PT": number;
  BLK: number;
  STL: number;
  [key: string]: string | number;
}

interface DetailsTableProps {
  headers: string[];
  rows: TableRow[];
}

export default function DetailsTable({ headers, rows }: DetailsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm text-gray-700 dark:text-gray-300">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {rows.map((row, index) => (
            <tr
              key={index}
              className={`
                ${
                  index % 2 === 0
                    ? "bg-white dark:bg-black"
                    : "bg-gray-50 dark:bg-gray-900/50"
                }
                hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
              `}
            >
              {headers.map((header) => (
                <td
                  key={`${index}-${header}`}
                  className={`px-4 py-3 ${
                    typeof row[header] === "number" ? "text-right" : "text-left"
                  }`}
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
