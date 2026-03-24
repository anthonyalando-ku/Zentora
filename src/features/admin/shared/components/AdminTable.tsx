import { cn } from "@/shared/utils/cn";

export const AdminTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
};

export const AdminTableHead = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-secondary/5">{children}</thead>
);

export const AdminTh = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn("text-left text-xs font-semibold text-foreground/60 px-4 py-3 whitespace-nowrap", className)}>
    {children}
  </th>
);

export const AdminTd = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={cn("text-sm text-foreground px-4 py-3 align-middle", className)}>{children}</td>
);

export const AdminTr = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-t border-border hover:bg-secondary/5 transition-colors">{children}</tr>
);