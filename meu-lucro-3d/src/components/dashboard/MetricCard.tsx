import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type ColorVariant = 'green' | 'red' | 'blue' | 'purple' | 'orange' | 'indigo';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label?: string };
  color?: ColorVariant;
  loading?: boolean;
  large?: boolean;
}

const colorMap: Record<ColorVariant, { bg: string; icon: string; trend: string }> = {
  green: {
    bg: 'from-green-500/20 to-emerald-500/20 border-green-500/20',
    icon: 'from-green-500 to-emerald-600',
    trend: 'text-green-400',
  },
  red: {
    bg: 'from-red-500/20 to-rose-500/20 border-red-500/20',
    icon: 'from-red-500 to-rose-600',
    trend: 'text-red-400',
  },
  blue: {
    bg: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20',
    icon: 'from-blue-500 to-cyan-600',
    trend: 'text-blue-400',
  },
  purple: {
    bg: 'from-purple-500/20 to-violet-500/20 border-purple-500/20',
    icon: 'from-purple-500 to-violet-600',
    trend: 'text-purple-400',
  },
  orange: {
    bg: 'from-orange-500/20 to-amber-500/20 border-orange-500/20',
    icon: 'from-orange-500 to-amber-600',
    trend: 'text-orange-400',
  },
  indigo: {
    bg: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/20',
    icon: 'from-indigo-500 to-violet-600',
    trend: 'text-indigo-400',
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'indigo',
  loading = false,
  large = false,
}: MetricCardProps) {
  const colors = colorMap[color];

  if (loading) {
    return (
      <div className={cn(
        'bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse',
        large && 'col-span-2'
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-700 rounded w-24" />
          <div className="w-10 h-10 bg-slate-700 rounded-xl" />
        </div>
        <div className="h-8 bg-slate-700 rounded w-32 mb-2" />
        <div className="h-3 bg-slate-700 rounded w-20" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative bg-slate-900 border border-slate-800 rounded-2xl p-5',
        'hover:border-slate-700 transition-all duration-200 group',
        'overflow-hidden',
        large && 'md:col-span-2'
      )}
    >
      {/* Background glow */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-br', colors.bg
      )} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400">{title}</span>
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br shadow-lg',
            colors.icon
          )}>
            <Icon size={18} className="text-white" />
          </div>
        </div>

        {/* Value */}
        <p className={cn(
          'font-bold text-slate-100 mb-1',
          large ? 'text-3xl' : 'text-2xl'
        )}>
          {value}
        </p>

        {/* Subtitle + Trend */}
        <div className="flex items-center justify-between">
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
              trend.value > 0
                ? 'bg-green-500/10 text-green-400'
                : trend.value < 0
                ? 'bg-red-500/10 text-red-400'
                : 'bg-slate-700 text-slate-400'
            )}>
              {trend.value > 0 ? (
                <TrendingUp size={11} />
              ) : trend.value < 0 ? (
                <TrendingDown size={11} />
              ) : (
                <Minus size={11} />
              )}
              <span>
                {Math.abs(trend.value).toFixed(1)}%
                {trend.label && ` ${trend.label}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
