import React from 'react';
import { LucideIcon } from 'lucide-react';
import { RiskLevel, DataStatus } from '../../types';

// ==========================================
// 1. STATUS BADGES & DATA CHIPS
// ==========================================

export const RiskBadge: React.FC<{
  level: RiskLevel | string;
  size?: 'sm' | 'md';
  className?: string;
}> = ({ level, size = 'sm', className = '' }) => {
  const normLevel = (level || 'LOW').toUpperCase();

  const config = {
    CRITICAL: 'bg-rose-50 text-rose-900 border-rose-300 font-semibold',
    HIGH: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    MODERATE: 'bg-sky-50 text-sky-900 border-sky-300 font-semibold',
    LOW: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold',
  }[normLevel] || 'bg-slate-50 text-slate-800 border-slate-300 font-medium';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-sans uppercase tracking-wide shrink-0 ${sizeClasses} ${config} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          normLevel === 'CRITICAL'
            ? 'bg-rose-600'
            : normLevel === 'HIGH'
            ? 'bg-amber-600'
            : normLevel === 'MODERATE'
            ? 'bg-sky-600'
            : 'bg-emerald-600'
        }`}
      />
      <span>{normLevel} RISK</span>
    </span>
  );
};

export const DataStatusBadge: React.FC<{
  status: DataStatus | string;
  className?: string;
}> = ({ status, className = '' }) => {
  const norm = (status || 'DEMO').toUpperCase();

  const styleMap: Record<string, string> = {
    OBSERVED: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    REPORTED: 'bg-slate-100 text-slate-800 border-slate-300',
    MODELLED: 'bg-indigo-50 text-indigo-900 border-indigo-300',
    ESTIMATED: 'bg-amber-50 text-amber-900 border-amber-300',
    DEMO: 'bg-amber-500/10 text-amber-800 border-amber-300',
  };

  const style = styleMap[norm] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium border uppercase tracking-wider ${style} ${className}`}
    >
      {norm}
    </span>
  );
};

// ==========================================
// 2. UNIFIED PAGE HEADER
// ==========================================

export interface PageHeaderProps {
  category: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  badge?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
}) => {
  return (
    <header className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {Icon && <Icon className="w-4 h-4 text-emerald-900 shrink-0" />}
          <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
            {category}
          </span>
          {badge && (
            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {badge}
            </span>
          )}
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {actions && (
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
};

// ==========================================
// 3. UNIFIED METRIC KPI STAT CARD
// ==========================================

export interface MetricStatProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  trend?: 'up' | 'down' | string;
  onClick?: () => void;
  className?: string;
}

export const MetricStat: React.FC<MetricStatProps> = ({
  label,
  value,
  unit,
  subtext,
  icon: Icon,
  variant = 'default',
  trend,
  onClick,
  className = '',
}) => {
  const valueColor = {
    default: 'text-slate-900',
    critical: 'text-rose-700',
    warning: 'text-amber-700',
    success: 'text-emerald-800',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between ${
        onClick
          ? 'cursor-pointer hover:border-emerald-500 hover:shadow-md hover:bg-slate-50/70 transition-all select-none active:scale-[0.99]'
          : ''
      } ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="flex items-center justify-between gap-2 text-slate-500 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">
          {label}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {trend && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                trend === 'down'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : trend}
            </span>
          )}
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
        </div>
      </div>
      <div className="flex items-baseline gap-1 my-1">
        <span className={`text-2xl font-bold font-mono tracking-tight ${valueColor}`}>
          {value}
        </span>
        {unit && <span className="text-xs font-normal text-slate-500 ml-0.5">{unit}</span>}
      </div>
      <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mt-0.5">
        <span className="truncate">{subtext}</span>
        {onClick && (
          <span className="text-[10px] font-semibold text-emerald-700 shrink-0 opacity-80 group-hover:opacity-100">
            Open →
          </span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. UNIFIED CONTAINER CARD
// ==========================================

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
}> = ({ children, className = '', id, noPadding = false }) => {
  return (
    <div
      id={id}
      className={`bg-white border border-slate-200 rounded-xl shadow-2xs ${
        noPadding ? '' : 'p-4 sm:p-5'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, badge, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-3 pb-3 border-b border-slate-100 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// ==========================================
// 5. BUTTON STYLES & PRESETS
// ==========================================

export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: LucideIcon;
}> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon: Icon,
}) => {
  const base =
    'inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  const variantClasses = {
    primary: 'bg-emerald-900 hover:bg-emerald-800 text-white shadow-2xs border border-emerald-950',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border border-transparent',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-2xs border border-rose-900',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizeClasses} ${variantClasses} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};
