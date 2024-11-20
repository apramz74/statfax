interface QuerySummaryProps {
  summary: {
    value: number | string;
    description: string;
  };
}

export default function QuerySummary({ summary }: QuerySummaryProps) {
  return <div className="query-summary">{/* Display summary result */}</div>;
}
