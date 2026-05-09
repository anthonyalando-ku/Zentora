const TableSkeleton = ({ rows = 6 }: { rows?: number }) => {
  const colWidths = ["w-32", "w-28", "w-20", "w-16", "w-24", "w-12"];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[880px] w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {["Order", "Customer", "Status", "Total", "Created", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-foreground/40 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-border"
              style={{ opacity: 1 - i * 0.08 }}
            >
              {colWidths.map((w, j) => (
                <td key={j} className="px-4 py-3.5">
                  <div
                    className={`h-3.5 ${w} rounded-md bg-foreground/8 animate-pulse`}
                    style={{ animationDelay: `${j * 55}ms` }}
                  />
                  {j === 0 && (
                    <div
                      className="mt-1.5 h-2.5 w-16 rounded-md bg-foreground/8 animate-pulse"
                      style={{ animationDelay: `${j * 55 + 28}ms` }}
                    />
                  )}
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