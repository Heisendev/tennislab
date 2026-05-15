import { cva } from 'class-variance-authority';
import { CheckCircle, Clock, PauseCircle, PlayCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type MatchStatus = 'scheduled' | 'in-progress' | 'suspended' | 'resumed' | 'completed';

interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

const badgeStyles = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest rounded-full',
  {
    variants: {
      status: {
        scheduled:    'bg-(--dark-100) text-(--dark-600)',
        'in-progress':'bg-(--clay-100) text-(--clay-700)',
        suspended:    'bg-(--gold-100) text-(--gold-700)',
        resumed:      'bg-(--green-100) text-(--green-600)',
        completed:    'bg-(--green-100) text-(--green-700)',
      },
    },
  }
);

const icons: Record<MatchStatus, React.ComponentType<{ className?: string }>> = {
  scheduled:    Clock,
  'in-progress': Zap,
  suspended:    PauseCircle,
  resumed:      PlayCircle,
  completed:    CheckCircle,
};

const isLive = (status: MatchStatus) => status === 'in-progress' || status === 'resumed';

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const Icon = icons[status];
  return (
    <span className={badgeStyles({ status }) + (className ? ` ${className}` : '')}>
      {isLive(status) ? (
        <span className="w-1.5 h-1.5 rounded-full bg-(--color-in-progress) live-pulse" />
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {t(`liveMatch.${status}`, { defaultValue: status })}
    </span>
  );
}
