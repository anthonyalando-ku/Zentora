import { cn } from "@/shared/utils/cn";

type AdminModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const AdminModal = ({ open, title, subtitle, children, onClose }: AdminModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={cn("w-full max-w-xl rounded-2xl border border-border bg-background shadow-xl overflow-hidden")}>
          <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-base font-semibold text-foreground">{title}</div>
              {subtitle && <div className="text-sm text-foreground/60 mt-0.5">{subtitle}</div>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-border hover:bg-secondary/10 transition"
              aria-label="Close modal"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
};