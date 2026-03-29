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
    <div className="rounded-2xl border border-border bg-background p-8 sm:p-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 3h10a2 2 0 0 1 2 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2Z" />
        </svg>
      </div>
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm text-foreground/60 mt-1 max-w-md mx-auto">{message}</div>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
};

export default EmptyState;