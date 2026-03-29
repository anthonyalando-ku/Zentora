const TableSkeleton = ({ rows = 6 }: { rows?: number }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[880px] w-full">
        <thead className="bg-secondary/5">
          <tr className="text-left">
            {["Order", "Customer", "Status", "Total", "Created", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold text-foreground/60 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t border-border">
              {Array.from({ length: 6 }).map((__, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 w-full max-w-[160px] bg-foreground/10 rounded animate-pulse" />
                  {j === 0 ? <div className="mt-2 h-3 w-20 bg-foreground/10 rounded animate-pulse" /> : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;