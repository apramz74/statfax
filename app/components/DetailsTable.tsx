interface DetailsTableProps {
  headers: string[];
  rows: any[];
  sortable?: boolean;
}

export default function DetailsTable({
  headers,
  rows,
  sortable,
}: DetailsTableProps) {
  return (
    <div className="details-table">
      {/* Render sortable, paginated table */}
    </div>
  );
}
