import { cn } from '@/shared/utils/cn';

type BadgeVariant = 'new' | 'hot' | 'sale' | 'default' | 'featured';

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  new: 'bg-blue-500 text-white',
  hot: 'bg-secondary text-white',
  sale: 'bg-destructive text-white',
  default: 'bg-primary text-white',
  featured: 'bg-yellow-500 text-white',
};

export const Badge = ({ variant = 'default', children, className }: BadgeProps) => (
  <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide', variantStyles[variant], className)}>
    {children}
  </span>
);
