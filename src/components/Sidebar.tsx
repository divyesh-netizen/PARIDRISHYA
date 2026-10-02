import React from 'react';
import {
  LayoutDashboard,
  Factory,
  Flame,
  Wind,
  MapPin,
  TrendingUp,
  Sliders,
  FileText,
  Landmark,
  Building2,
  Code2,
  Layers,
  BookOpen,
  Server,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  currentRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  currentRole,
  isCollapsed,
  onToggleCollapse,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const mainNavigation = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'industrial', label: 'Industrial Intelligence', icon: Factory, badge: '18 Sites' },
    { id: 'regional-risk', label: 'Regional Risk GIS', icon: MapPin, badge: 'Hotspots' },
    { id: 'impact', label: 'Environmental Impact', icon: Flame, badge: 'Modelled' },
    { id: 'pollution', label: 'Pollution Analysis', icon: Wind, badge: null },
    { id: 'prediction', label: 'Prediction & Forecast', icon: TrendingUp, badge: '2027-30' },
    { id: 'what-if', label: 'What-If Simulator', icon: Sliders, badge: 'Simulate' },
    { id: 'reports', label: 'Assessment Reports', icon: FileText, badge: 'PDF/CSV' },
  ];

  const portalNavigation = [
    {
      id: 'government',
      label: 'Government Portal',
      icon: Landmark,
      roles: ['ADMIN', 'GOVERNMENT', 'ANALYST'],
      badge: 'Decisions',
    },
    {
      id: 'industry',
      label: 'Industry Portal',
      icon: Building2,
      roles: ['ADMIN', 'INDUSTRY', 'ANALYST'],
      badge: 'Facility',
    },
  ];

  const platformNavigation = [
    { id: 'api', label: 'Intelligence API & x402', icon: Code2, badge: 'Pay-per-use' },
    { id: 'data-sources', label: 'Data Sources Registry', icon: Layers, badge: 'Metadata' },
    { id: 'methodology', label: 'Methodology & Disclaimers', icon: BookOpen, badge: null },
    { id: 'supabase', label: 'Architecture & Supabase', icon: Server, badge: 'Postgres' },
    { id: 'about', label: 'About PARIDRISHYA', icon: HelpCircle, badge: null },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderNavContent = (isMobileView = false) => {
    const collapsed = !isMobileView && isCollapsed;

    return (
      <div className="flex flex-col h-full">
        {/* Top Header Label */}
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-900 flex items-center justify-center text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
            </div>
            {(!collapsed || isMobileView) && (
              <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
                Decision Workspace
              </span>
            )}
          </div>

          {isMobileView ? (
            <button
              onClick={onCloseMobile}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {/* Core Intelligence Modules */}
          <div>
            {(!collapsed || isMobileView) && (
              <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Core Intelligence
              </div>
            )}
            <div className="space-y-0.5">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800/70 text-white font-semibold shadow-xs border-l-2 border-emerald-400'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    {(!collapsed || isMobileView) && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {(!collapsed || isMobileView) && item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                          isActive
                            ? 'bg-emerald-700/80 text-emerald-100'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stakeholder Portals */}
          <div>
            {(!collapsed || isMobileView) && (
              <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Stakeholder Portals
              </div>
            )}
            <div className="space-y-0.5">
              {portalNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                const isAllowed = item.roles.includes(currentRole);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800/70 text-white font-semibold shadow-xs border-l-2 border-emerald-400'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    {(!collapsed || isMobileView) && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {(!collapsed || isMobileView) && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                          isAllowed ? 'bg-slate-800 text-slate-300' : 'bg-amber-900/50 text-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform & System Architecture */}
          <div>
            {(!collapsed || isMobileView) && (
              <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Infrastructure & API
              </div>
            )}
            <div className="space-y-0.5">
              {platformNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-800/70 text-white font-semibold shadow-xs border-l-2 border-emerald-400'
                        : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-slate-400'}`} />
                    {(!collapsed || isMobileView) && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {(!collapsed || isMobileView) && item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-800 text-slate-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Health Pill */}
        {(!collapsed || isMobileView) && (
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Pipeline Status:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500 text-[10px]">
              <span>Active DB Schema:</span>
              <span className="text-slate-300 font-mono">20 Entities Ready</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-200 shrink-0 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {renderNavContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isOpenOnMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col z-10 shadow-2xl h-full border-r border-slate-800">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
