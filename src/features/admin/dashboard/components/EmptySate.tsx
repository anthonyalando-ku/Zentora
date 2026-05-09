const EmptyState = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-primary/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6M7 3h10a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z"
            />
          </svg>
        </div>
        <div className="absolute inset-0 -m-2 rounded-3xl border border-dashed border-border" />
      </div>

      <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-foreground/50 max-w-xs leading-relaxed">{message}</p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;