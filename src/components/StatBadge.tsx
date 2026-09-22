import { type LucideIcon } from 'lucide-react';

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function StatBadge({ icon: Icon, label, value }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div>
        <div className="font-display text-lg font-extrabold text-ink-900 leading-none">{value}</div>
        <div className="text-xs font-medium text-ink-500 mt-1">{label}</div>
      </div>
    </div>
  );
}
