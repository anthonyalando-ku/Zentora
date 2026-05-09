import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { ChevronDownIcon } from "./icons";

export const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        className="w-full flex items-center justify-between py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <ChevronDownIcon className={cn("transition-transform duration-200", open ? "rotate-180" : "")} />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
};