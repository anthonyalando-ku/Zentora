import { cn } from "@/shared/utils/cn";

type FloatingActionsProps = {
  /** Phone number in international format used for the tel: link. e.g. "+26771234567" */
  phoneNumber?: string;
  /** Display number shown when the FAB is expanded. e.g. "+267 71 234 567" */
  phoneDisplay?: string;
  /** WhatsApp number (digits only, no +). e.g. "26771234567" */
  whatsappNumber?: string;
  /** Pre-filled message for the WhatsApp deep link. */
  whatsappMessage?: string;
  /**
   * Extra Tailwind classes for the wrapper, e.g. to override placement.
   * Default keeps FABs visible on all viewports, lifted above the mobile
   * bottom nav (76px) and sitting at 20px on md+.
   */
  className?: string;
};

/**
 * Two floating action buttons fixed to the right edge of the viewport:
 *   • Call shop  (tel:)
 *   • WhatsApp   (wa.me)
 *
 *  • Visible on every viewport. On mobile they sit above the BottomNav;
 *    on md+ they sit at standard offset.
 *  • Compact icon-only by default; on md+ they expand on hover to reveal
 *    label + sub-line (pure CSS — each anchor handles its own :hover so
 *    sibling buttons stay completely independent).
 *  • Drop-in for any page: import + place <FloatingActions /> inside a
 *    page wrapped in <MainLayout>.
 */
export const FloatingActions = ({
  phoneNumber = "+254795974591",
  phoneDisplay = "+254 795 974591",
  whatsappNumber = "254795974591",
  whatsappMessage = "Hi! I have a question about a product on Zentora.",
  className,
}: FloatingActionsProps) => {
  return (
    <div
      aria-label="Quick contact"
      className={cn(
        "fixed right-4 sm:right-5 z-30",
        "flex flex-col items-end gap-2.5",
        "pointer-events-none",
        // Lift above BottomNav (h-16 + safe-area) on mobile; standard offset on md+.
        "bottom-[calc(env(safe-area-inset-bottom,0px)+76px)] md:bottom-5",
        className
      )}
    >
      <FAB
        href={`tel:${phoneNumber}`}
        ariaLabel={`Call shop at ${phoneDisplay}`}
        label="Call shop"
        sub={phoneDisplay}
        toneClass="bg-foreground text-background"
        ringToneClass="bg-background/20"
      >
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 4h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </svg>
      </FAB>

      <FAB
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        ariaLabel="Chat with us on WhatsApp"
        label="Chat on WhatsApp"
        sub="Typically replies in minutes"
        toneClass="bg-[#25D366] text-white"
        ringToneClass="bg-white/20"
      >
        <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 20.5 5 16a8 8 0 1 1 3 3l-4.5 1.5Z" />
          <path strokeWidth={1.4} d="M9 10c.3 1.8 1.7 3.2 3.5 3.7l1.3-1c.4-.3 1-.3 1.4 0l1.6 1c.4.3.5.8.3 1.2a2.5 2.5 0 0 1-2.2 1.4 7 7 0 0 1-6.9-6.9c0-1 .6-1.9 1.4-2.2.4-.2.9 0 1.2.3l1 1.6c.3.4.3 1 0 1.4l-1 1.3Z" />
        </svg>
      </FAB>
    </div>
  );
};

type FABProps = {
  href: string;
  ariaLabel: string;
  label: string;
  sub: string;
  toneClass: string;
  ringToneClass: string;
  target?: "_blank";
  children: React.ReactNode;
};

/**
 * Single FAB — purely CSS-driven hover. The anchor itself owns `.group`,
 * so :hover and group-hover never bleed onto sibling FABs. On mobile (no
 * hover capable input), the icon stays compact and the label is hidden.
 */
const FAB = ({
  href,
  ariaLabel,
  label,
  sub,
  toneClass,
  ringToneClass,
  target,
  children,
}: FABProps) => (
  <a
    href={href}
    target={target}
    rel={target === "_blank" ? "noopener noreferrer" : undefined}
    aria-label={ariaLabel}
    className={cn(
      "pointer-events-auto group flex items-center gap-3",
      "rounded-full shadow-[0_12px_28px_-10px_rgba(15,23,31,.35)]",
      toneClass,
      // Compact (mobile + desktop idle)
      "p-2.5 max-w-[52px]",
      // Desktop hover expands
      "md:transition-[padding,max-width] md:duration-200 md:ease-out",
      "md:hover:pl-2.5 md:hover:pr-5 md:hover:max-w-[280px]",
      "md:focus-visible:pl-2.5 md:focus-visible:pr-5 md:focus-visible:max-w-[280px]",
      "overflow-hidden"
    )}
  >
    <span className={cn("h-9 w-9 rounded-full grid place-items-center flex-shrink-0", ringToneClass)}>
      {children}
    </span>
    <span
      className={cn(
        "hidden md:block whitespace-nowrap",
        "opacity-0 transition-opacity duration-150",
        "group-hover:opacity-100 group-hover:delay-75",
        "group-focus-visible:opacity-100 group-focus-visible:delay-75"
      )}
    >
      <span className="block text-[13px] font-bold leading-tight">{label}</span>
      <span className="block text-[10.5px] opacity-85 mt-0.5">{sub}</span>
    </span>
  </a>
);
