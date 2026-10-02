import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ReportModal } from './components/ReportModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { IndustrialIntelligencePage } from './pages/IndustrialIntelligencePage';
import { FacilityDetailPage } from './pages/FacilityDetailPage';
import { RegionalRiskPage } from './pages/RegionalRiskPage';
import { EnvironmentalImpactPage } from './pages/EnvironmentalImpactPage';
import { PollutionAnalysisPage } from './pages/PollutionAnalysisPage';
import { PredictionPage } from './pages/PredictionPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { ReportsPage } from './pages/ReportsPage';
import { GovernmentPortalPage } from './pages/GovernmentPortalPage';
import { IndustryPortalPage } from './pages/IndustryPortalPage';
import { IntelligenceApiPage } from './pages/IntelligenceApiPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { SupabaseStatusPage } from './pages/SupabaseStatusPage';
import { AboutPage } from './pages/AboutPage';

// Domain Data & Types
import {
  MOCK_FACILITIES,
  MOCK_REGIONS,
  MOCK_ALERTS,
  MOCK_DATA_SOURCES,
  MOCK_API_ENDPOINTS,
} from './data/mockData';
import { Facility, Region, UserRole, SystemAlert } from './types';
import {
  AlertTriangle,
  X,
  Shield,
  LayoutDashboard,
  Factory,
  MapPin,
  Sliders,
  Layers,
} from 'lucide-react';

export default function App() {
  // Read initial section from window.location.hash
  const getInitialSection = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const cleanHash = window.location.hash.replace('#', '').trim();
      if (cleanHash) return cleanHash;
    }
    return 'dashboard';
  };

  const [activeRole, setActiveRole] = useState<UserRole>('ADMIN');
  const [activeSection, setActiveSection] = useState<string>(getInitialSection);
  const [facilities, setFacilities] = useState<Facility[]>(MOCK_FACILITIES);
  const [regions, setRegions] = useState<Region[]>(MOCK_REGIONS);
  const [alerts, setAlerts] = useState<SystemAlert[]>(MOCK_ALERTS);
  const [selectedFacility, setSelectedFacility] = useState<Facility>(MOCK_FACILITIES[0]);
  const [selectedRegion, setSelectedRegion] = useState<Region>(MOCK_REGIONS[0]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetFacility, setReportTargetFacility] = useState<Facility>(MOCK_FACILITIES[0]);

  // Dismissible Alert Banner
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Central Navigation Handler with Hash Synchronization
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      window.location.hash = section;
    }
    setIsMobileMenuOpen(false);

    // Smoothly scroll the page content to the top
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync state if user navigates using browser back / forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch facilities & regions from backend API (with resilient parsing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facRes, regRes, alertRes] = await Promise.all([
          fetch('/api/facilities'),
          fetch('/api/regions'),
          fetch('/api/alerts'),
        ]);

        if (facRes.ok) {
          const facData = await facRes.json();
          const list = Array.isArray(facData) ? facData : facData?.facilities;
          if (Array.isArray(list) && list.length > 0) {
            setFacilities(list);
            setSelectedFacility(list[0]);
            setReportTargetFacility(list[0]);
          }
        }

        if (regRes.ok) {
          const regData = await regRes.json();
          const list = Array.isArray(regData) ? regData : regData?.regions;
          if (Array.isArray(list) && list.length > 0) {
            setRegions(list);
            setSelectedRegion(list[0]);
          }
        }

        if (alertRes.ok) {
          const alertData = await alertRes.json();
          const list = Array.isArray(alertData) ? alertData : alertData?.alerts;
          if (Array.isArray(list)) {
            setAlerts(list);
          }
        }
      } catch (err) {
        console.log('Using verified baseline dataset:', err);
      }
    };

    fetchData();
  }, []);

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
    const parentRegion = regions.find((r) => r.id === facility.regionId);
    if (parentRegion) {
      setSelectedRegion(parentRegion);
    }
  };

  const handleOpenReportModal = (facility: Facility) => {
    setReportTargetFacility(facility);
    setIsReportModalOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    const match = facilities.find(
      (f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.code.toLowerCase().includes(query.toLowerCase()) ||
        f.sector.toLowerCase().includes(query.toLowerCase())
    );

    if (match) {
      setSelectedFacility(match);
      handleNavigate('facility-detail');
    } else {
      handleNavigate('industrial');
    }
  };

  // Render the currently selected page
  const renderCurrentPage = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardPage
            facilities={facilities}
            regions={regions}
            alerts={alerts}
            onSelectFacility={handleFacilitySelect}
            onSelectRegion={setSelectedRegion}
            onNavigate={handleNavigate}
          />
        );

      case 'industrial':
      case 'industrial-intelligence':
        return (
          <IndustrialIntelligencePage
            facilities={facilities}
            regions={regions}
            onSelectFacility={handleFacilitySelect}
            onNavigateToDetail={(fac) => {
              handleFacilitySelect(fac);
              handleNavigate('facility-detail');
            }}
            onOpenReportModal={handleOpenReportModal}
          />
        );

      case 'facility-detail':
        return (
          <FacilityDetailPage
            facility={selectedFacility}
            region={regions.find((r) => r.id === selectedFacility.regionId) || null}
            onBack={() => handleNavigate('industrial')}
            onOpenSimulator={() => handleNavigate('what-if')}
            onOpenReportModal={() => handleOpenReportModal(selectedFacility)}
          />
        );

      case 'regional-risk':
        return (
          <RegionalRiskPage
            regions={regions}
            facilities={facilities}
            onSelectFacility={handleFacilitySelect}
            onNavigateToDetail={(fac) => {
              handleFacilitySelect(fac);
              handleNavigate('facility-detail');
            }}
          />
        );

      case 'impact':
      case 'environmental-impact':
        return (
          <EnvironmentalImpactPage
            facilities={facilities}
            onSelectFacility={handleFacilitySelect}
            onNavigateToSimulator={() => handleNavigate('what-if')}
          />
        );

      case 'pollution':
      case 'pollution-analysis':
        return (
          <PollutionAnalysisPage
            facilities={facilities}
            regions={regions}
          />
        );

      case 'prediction':
      case 'predictions':
        return (
          <PredictionPage
            facilities={facilities}
            onNavigateToSimulator={() => handleNavigate('what-if')}
          />
        );

      case 'what-if':
        return <WhatIfPage facilities={facilities} />;

      case 'reports':
        return (
          <ReportsPage
            facilities={facilities}
            regions={regions}
            onOpenReportModal={handleOpenReportModal}
          />
        );

      case 'government':
      case 'government-portal':
        return (
          <GovernmentPortalPage
            facilities={facilities}
            regions={regions}
            onSelectFacility={handleFacilitySelect}
            onNavigateToDetail={(fac) => {
              handleFacilitySelect(fac);
              handleNavigate('facility-detail');
            }}
            onNavigateToSimulator={() => handleNavigate('what-if')}
          />
        );

      case 'industry':
      case 'industry-portal':
        return (
          <IndustryPortalPage
            facilities={facilities}
            onSelectFacility={handleFacilitySelect}
            onNavigateToSimulator={() => handleNavigate('what-if')}
            onOpenReportModal={handleOpenReportModal}
          />
        );

      case 'api':
      case 'api-docs':
        return (
          <IntelligenceApiPage
            apiSpecs={MOCK_API_ENDPOINTS}
            facilities={facilities}
          />
        );

      case 'data-sources':
        return <DataSourcesPage sources={MOCK_DATA_SOURCES} />;

      case 'methodology':
        return <MethodologyPage />;

      case 'supabase':
        return <SupabaseStatusPage />;

      case 'about':
        return <AboutPage />;

      default:
        return (
          <DashboardPage
            facilities={facilities}
            regions={regions}
            alerts={alerts}
            onSelectFacility={handleFacilitySelect}
            onSelectRegion={setSelectedRegion}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentRole={activeRole}
        activeRole={activeRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          if (role === 'GOVERNMENT') handleNavigate('government');
          else if (role === 'INDUSTRY') handleNavigate('industry');
          else if (role === 'ANALYST') handleNavigate('impact');
          else handleNavigate('dashboard');
        }}
        alerts={alerts}
        facilities={facilities}
        regions={regions}
        onSelectFacility={(fac) => {
          handleFacilitySelect(fac);
          handleNavigate('facility-detail');
        }}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          handleNavigate('regional-risk');
        }}
        onSelectAlertFacility={(facilityId) => {
          const fac = facilities.find((f) => f.id === facilityId);
          if (fac) {
            handleFacilitySelect(fac);
            handleNavigate('facility-detail');
          }
        }}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Persistent System Alert Ticker (Dismissible) */}
      {!isAlertDismissed && alerts.length > 0 && (
        <div className="no-print bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
            <span className="font-bold uppercase tracking-wider text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded">
              Active Regional Alert
            </span>
            <span className="truncate">
              <strong>{alerts[0].facilityName || alerts[0].title}:</strong> {alerts[0].reason || alerts[0].title}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const fac = facilities.find((f) => f.name === alerts[0].facilityName);
                if (fac) {
                  setSelectedFacility(fac);
                  handleNavigate('facility-detail');
                }
              }}
              className="text-[11px] font-extrabold underline hover:text-white transition-colors cursor-pointer"
            >
              Inspect Incident →
            </button>
            <button
              onClick={() => setIsAlertDismissed(true)}
              className="p-1 hover:bg-amber-600/50 rounded transition-colors text-slate-950 cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Container Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (Desktop sticky & Mobile slide-over drawer) */}
        <Sidebar
          currentSection={activeSection}
          onNavigate={handleNavigate}
          currentRole={activeRole}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOpenOnMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-12">
          <div className="max-w-7xl mx-auto pb-12">
            <ErrorBoundary onReset={() => handleNavigate('dashboard')}>
              {renderCurrentPage()}
            </ErrorBoundary>
          </div>

          {/* Institutional Footer */}
          <footer className="no-print border-t border-slate-200 mt-12 pt-6 pb-8 text-xs text-slate-500 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span className="font-bold text-slate-800">PARIDRISHYA</span>
              <span>— Platform for Regional Assessment, Industrial Risk & Sustainability</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <button
                onClick={() => handleNavigate('methodology')}
                className="hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Scientific Methodology
              </button>
              <button
                onClick={() => handleNavigate('data-sources')}
                className="hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Data Provenance
              </button>
              <button
                onClick={() => handleNavigate('supabase')}
                className="hover:text-emerald-800 hover:underline cursor-pointer"
              >
                PostgreSQL Schema
              </button>
              <button
                onClick={() => handleNavigate('api-docs')}
                className="hover:text-emerald-800 hover:underline cursor-pointer"
              >
                x402 API
              </button>
              <button
                onClick={() => handleNavigate('about')}
                className="hover:text-emerald-800 hover:underline cursor-pointer"
              >
                About Platform
              </button>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Sticky Bottom Touch Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 flex justify-around items-center shadow-lg text-slate-600 select-none">
        <button
          onClick={() => handleNavigate('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            activeSection === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => handleNavigate('industrial')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            activeSection === 'industrial' || activeSection === 'facility-detail'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Sites</span>
        </button>
        <button
          onClick={() => handleNavigate('regional-risk')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            activeSection === 'regional-risk' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>GIS Map</span>
        </button>
        <button
          onClick={() => handleNavigate('what-if')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            activeSection === 'what-if' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Simulator</span>
        </button>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <Layers className="w-4 h-4 text-emerald-800" />
          <span className="font-semibold text-emerald-900">All Modules</span>
        </button>
      </nav>

      {/* Global Report Modal */}
      {isReportModalOpen && (
        <ReportModal
          facility={reportTargetFacility}
          region={regions.find((r) => r.id === reportTargetFacility.regionId) || null}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}
