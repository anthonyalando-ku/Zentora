type ConfirmDangerButtonProps = {
  label?: string;
  confirmText?: string;
  disabled?: boolean;
  onConfirm: () => Promise<void> | void;
};

export const ConfirmDangerButton = ({
  label = "Delete",
  confirmText = "Delete this item?",
  disabled,
  onConfirm,
}: ConfirmDangerButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-xl font-medium transition h-9 px-3 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 disabled:opacity-60"
      onClick={async () => {
        if (!confirm(confirmText)) return;
        await onConfirm();
      }}
      aria-label={label}
      title={label}
    >
      {label}
    </button>
  );
};