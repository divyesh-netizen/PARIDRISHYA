import React, { useState } from 'react';
import {
  Shield,
  Search,
  Bell,
  Activity,
  UserCheck,
  ChevronDown,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  Menu,
} from 'lucide-react';
import { UserRole, SystemAlert, Facility, Region } from '../types';

interface NavbarProps {
  currentRole?: UserRole;
  activeRole?: UserRole;
  onRoleChange: (role: UserRole) => void;
  alerts?: SystemAlert[];
  onSelectAlertFacility?: (facilityId: string) => void;
  facilities?: Facility[];
  regions?: Region[];
  onSelectFacility?: (facility: Facility) => void;
  onSelectRegion?: (region: Region) => void;
  onNavigate: (section: string) => void;
  onSearch?: (query: string) => void;
  activeSection?: string;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  activeRole,
  onRoleChange,
  alerts = [],
  facilities = [],
  regions = [],
  onSelectFacility = (_facility: Facility) => {},
  onSelectRegion = (_region: Region) => {},
  onNavigate,
  onSearch,
  activeSection = 'dashboard',
  onToggleMobileMenu,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const effectiveRole: UserRole = currentRole || activeRole || 'ADMIN';
  const safeAlerts = alerts || [];
  const safeFacilities = facilities || [];
  const safeRegions = regions || [];

  const unreadAlerts = safeAlerts.filter((a) => !a.isRead);

  const filteredFacilities = searchQuery.trim()
    ? safeFacilities.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredRegions = searchQuery.trim()
    ? safeRegions.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'GOVERNMENT', title: 'Government Official', desc: 'State/District environmental oversight & regional intervention' },
    { role: 'INDUSTRY', title: 'Facility Operator', desc: 'Authorized facility energy, emissions, and mitigation modeling' },
    { role: 'ANALYST', title: 'Environmental Analyst', desc: 'Full analytical access, models, forecasting, and methodology' },
    { role: 'ADMIN', title: 'System Administrator', desc: 'Complete platform control, schema migrations & telemetry' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Identity & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-max">
          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-slate-800" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-900 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-900 text-base sm:text-lg">
                  PARIDRISHYA
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  v1.4 GOV-GRADE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block leading-none">
                Platform for Regional Assessment, Data, Industrial & Environmental Risk
              </p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-md bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-medium">DEMO DATA MODE</span>
            <span className="text-amber-700 text-[11px]">— Deterministic Baseline</span>
          </div>
        </div>

        {/* Quick Nav Links on Larger Screens */}
        <nav className="hidden 2xl:flex items-center gap-1 text-xs">
          {[
            { id: 'dashboard', label: 'Overview' },
            { id: 'industrial', label: '18 Sites' },
            { id: 'regional-risk', label: 'Regional GIS' },
            { id: 'impact', label: 'Impact' },
            { id: 'pollution', label: 'Pollution' },
            { id: 'what-if', label: 'Simulator' },
            { id: 'reports', label: 'Reports' },
          ].map((nav) => {
            const isActive = activeSection === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => onNavigate(nav.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facilities, industrial corridors, states, sectors..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Facilities ({filteredFacilities.length})
              </div>
              {filteredFacilities.slice(0, 5).map((facility) => (
                <div
                  key={facility.id}
                  onClick={() => {
                    onSelectFacility(facility);
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-slate-800">{facility.name}</span>
                    <span className="ml-2 text-slate-400">({facility.sector})</span>
                    <p className="text-[11px] text-slate-500">{facility.regionName}, {facility.state}</p>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      facility.riskLevel === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-800'
                        : facility.riskLevel === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {facility.impactScore}/100
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-100 my-1 pt-1 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Regions ({filteredRegions.length})
              </div>
              {filteredRegions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => {
                    onSelectRegion(region);
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-slate-800">{region.name}</span>
                    <p className="text-[11px] text-slate-500">{region.state} • {region.facilityCount} Facilities</p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">AQI: {region.airQualityIndex}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls: Alerts, Role, Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition-colors"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {showAlertMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">Active Environmental Alerts</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      {safeAlerts.length} Total
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAlertMenu(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {safeAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 hover:bg-slate-50 text-xs transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                      <h4 className="font-semibold text-slate-800 leading-tight mb-1">{alert.title}</h4>
                      <p className="text-[11px] text-slate-600 mb-1.5">{alert.reason}</p>
                      <div className="p-1.5 bg-slate-100/80 rounded text-[10px] text-slate-700 flex items-start gap-1">
                        <span className="font-semibold text-emerald-800">Action:</span>
                        <span>{alert.recommendedAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <div className="text-left hidden sm:block leading-none">
                <span className="text-[9px] text-slate-400 block uppercase font-semibold">Active Role</span>
                <span className="font-bold text-slate-800">{effectiveRole}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulate Access Profile (RLS)
                  </p>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      onRoleChange(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      effectiveRole === r.role ? 'bg-emerald-50/70' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {effectiveRole === r.role ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-800">{r.title}</div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Supabase / System Status Link */}
          <button
            onClick={() => onNavigate('supabase')}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Database Architecture & Supabase Status"
          >
            <Database className="w-4 h-4 text-emerald-800" />
          </button>
        </div>
      </div>
    </header>
  );
};
