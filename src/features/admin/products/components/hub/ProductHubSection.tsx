import type { ReactNode } from "react";

export const ProductHubSection = ({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <section className="rounded-2xl border border-border bg-background shadow-sm">
      <div className="px-5 py-4 border-b border-border flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-foreground">{title}</div>
          {description ? <div className="text-sm text-foreground/60 mt-1">{description}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
};