import React, { useState, useRef } from 'react';
import {
  Layers,
  MapPin,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Flame,
  Droplets,
  Wind,
  ShieldAlert,
  Search,
  X,
  Gauge,
  Activity,
  Compass,
  Building2,
  TreeDeciduous,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Facility, Region, RiskLevel } from '../types';

interface RegionalMapProps {
  facilities: Facility[];
  regions: Region[];
  selectedFacility: Facility | null;
  selectedRegion: Region | null;
  onSelectFacility: (facility: Facility) => void;
  onSelectRegion: (region: Region) => void;
  onViewFacilityDetail?: (facility: Facility) => void;
  onNavigateToSimulator?: (facility: Facility) => void;
}

// ----------------------------------------------------------------------------
// Accurate Geographical Polygon for the Republic of India (102 Boundary Points)
// Calibrated to standard WGS84 coordinates: Lat 6.8°N - 37.5°N, Lng 67.5°E - 97.5°E
// ----------------------------------------------------------------------------
const INDIA_COORDINATES: Array<[number, number]> = [
  // Northern Crown: Siachen Glacier, Karakoram, Ladakh & Jammu
  [37.1, 76.8], [36.8, 77.5], [35.9, 78.5], [35.4, 79.3], [34.5, 79.2], [33.8, 79.1], [33.2, 79.0],
  // Himachal Pradesh & Uttarakhand Himalayan frontier
  [32.2, 78.8], [31.5, 78.7], [30.9, 79.3], [30.5, 80.2], [30.2, 81.0],
  // Northern border along Nepal frontier
  [29.5, 81.8], [28.8, 83.2], [28.0, 85.0], [27.7, 86.8],
  // Sikkim thumb
  [27.6, 88.1], [28.1, 88.6], [27.7, 88.9],
  // Bhutan border
  [27.3, 89.2], [27.0, 91.5], [27.3, 92.0],
  // Arunachal Pradesh Himalayan ridge (Tawang, Dibang, Kibithu)
  [27.6, 92.4], [28.1, 93.5], [28.6, 94.6], [28.8, 95.8], [28.2, 97.0], [27.8, 97.3],
  // Eastern frontier (Patkai hills, Nagaland, Manipur, Mizoram)
  [26.9, 96.2], [26.0, 95.2], [24.8, 94.4], [23.8, 93.3], [22.4, 93.1], [21.9, 92.8],
  // Mizoram tip & Tripura enclave
  [22.8, 92.3], [23.5, 91.3], [24.2, 91.8], [24.8, 92.1],
  // Meghalaya southern scarp & Bengal Siliguri corridor
  [25.2, 91.2], [25.1, 89.9], [25.8, 89.8], [26.3, 88.8], [25.3, 88.2], [24.4, 88.6],
  // West Bengal & Sundarbans delta
  [22.8, 88.8], [21.7, 88.8], [21.5, 87.5],
  // Odisha coastline (Mahanadi delta, Chilika lake, Ganjam coast)
  [20.8, 86.9], [19.8, 85.8], [19.1, 84.8],
  // Andhra Pradesh coastline (Visakhapatnam, Godavari & Krishna deltas, Nellore)
  [18.2, 83.9], [17.3, 82.5], [16.3, 81.5], [15.6, 80.2], [14.0, 80.1],
  // Tamil Nadu Coromandel coast & Palk Strait (Chennai, Point Calimere, Rameswaram, Tuticorin)
  [13.1, 80.3], [11.9, 79.8], [10.8, 79.9], [9.9, 79.2], [9.3, 79.3], [8.8, 78.2],
  // Southernmost apex: Kanyakumari (Cape Comorin)
  [8.08, 77.55],
  // Kerala Malabar coast (Kovalam, Kochi, Kozhikode, Kannur)
  [8.5, 76.9], [9.5, 76.3], [10.5, 76.0], [11.5, 75.6], [12.2, 75.1],
  // Karnataka coast (Mangalore, Udupi, Karwar)
  [12.9, 74.8], [14.0, 74.4], [14.8, 74.1],
  // Goa indentation
  [15.4, 73.8],
  // Maharashtra Konkan coast (Ratnagiri, Mumbai harbor, Dahanu)
  [16.8, 73.3], [18.2, 72.9], [18.9, 72.8], [19.8, 72.7], [20.4, 72.7],
  // Gujarat coastline: Gulf of Khambhat, Saurashtra peninsula, Diu, Somnath, Dwarka
  [21.2, 72.7], [20.8, 71.9], [20.7, 70.9], [21.4, 69.8], [22.2, 69.0], [22.6, 69.1],
  // Gulf of Kutch & Great Rann of Kutch
  [22.9, 70.2], [23.2, 68.8], [23.7, 68.4], [24.1, 68.8], [24.4, 70.5], [24.6, 71.2],
  // Rajasthan western desert frontier (Barmer, Jaisalmer, Bikaner, Sri Ganganagar)
  [25.4, 70.8], [26.4, 70.1], [27.2, 70.2], [28.2, 71.2], [29.2, 72.5], [30.0, 73.5],
  // Punjab western border (Fazilka, Firozpur, Wagah / Amritsar, Pathankot)
  [30.8, 74.0], [31.6, 74.6], [32.3, 75.5],
  // Jammu & Kashmir border back to Ladakh
  [32.8, 74.8], [33.5, 74.2], [34.3, 73.9], [35.2, 74.6], [36.2, 75.5]
];

// Andaman & Nicobar Island Chain Coordinates (Lat, Lng)
const ANDAMAN_ISLANDS: Array<{ name: string; lat: number; lng: number; rx: number; ry: number }> = [
  { name: 'North Andaman', lat: 13.5, lng: 92.9, rx: 6, ry: 10 },
  { name: 'Middle Andaman', lat: 12.6, lng: 92.8, rx: 7, ry: 12 },
  { name: 'South Andaman (Port Blair)', lat: 11.6, lng: 92.7, rx: 6, ry: 11 },
  { name: 'Little Andaman', lat: 10.7, lng: 92.5, rx: 5, ry: 6 },
  { name: 'Car Nicobar', lat: 9.2, lng: 92.8, rx: 4, ry: 4 },
  { name: 'Great Nicobar', lat: 7.0, lng: 93.8, rx: 6, ry: 8 },
];

// Lakshadweep Archipelago Coordinates (Lat, Lng)
const LAKSHADWEEP_ISLANDS: Array<{ name: string; lat: number; lng: number; rx: number; ry: number }> = [
  { name: 'Amini & Kadmat', lat: 11.2, lng: 72.7, rx: 4, ry: 4 },
  { name: 'Kavaratti & Agatti', lat: 10.6, lng: 72.4, rx: 4, ry: 5 },
  { name: 'Kalpeni', lat: 10.1, lng: 73.6, rx: 3, ry: 4 },
  { name: 'Minicoy', lat: 8.3, lng: 73.0, rx: 4, ry: 4 },
];

export const RegionalMap: React.FC<RegionalMapProps> = ({
  facilities = [],
  regions = [],
  selectedFacility,
  selectedRegion,
  onSelectFacility,
  onSelectRegion,
  onViewFacilityDetail,
  onNavigateToSimulator,
}) => {
  const safeFacilities = facilities || [];
  const safeRegions = regions || [];

  const [activeLayers, setActiveLayers] = useState({
    facilities: true,
    riskZones: true,
    airPollution: true,
    waterStress: true,
    climateStress: false,
    corridors: true,
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  // Inspector Modal / Drawer state for dot click details
  const [inspectedFacility, setInspectedFacility] = useState<Facility | null>(null);
  const [inspectedRegion, setInspectedRegion] = useState<Region | null>(null);

  // Search in map
  const [searchQuery, setSearchQuery] = useState('');

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return '#f43f5e'; // rose-500
      case 'HIGH':
        return '#f59e0b'; // amber-500
      case 'MODERATE':
        return '#0284c7'; // sky-600
      case 'LOW':
        return '#10b981'; // emerald-500
    }
  };

  // SVG coordinate transformation function from Lat/Lng to 800x860 SVG viewport
  // India roughly bounding box: Lat 6.8°N to 37.5°N, Lng 67.5°E to 97.5°E
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 6.8;
    const maxLat = 37.5;
    const minLng = 67.5;
    const maxLng = 97.5;
    const width = 680;
    const height = 750;
    const offsetX = 50;
    const offsetY = 45;

    const x = offsetX + ((lng - minLng) / (maxLng - minLng)) * width;
    const y = offsetY + ((maxLat - lat) / (maxLat - minLat)) * height;

    return { x, y };
  };

  // Convert India coordinates to SVG path string
  const indiaPathPoints = INDIA_COORDINATES.map(([lat, lng]) => {
    const pt = projectCoords(lat, lng);
    return `${Math.round(pt.x * 10) / 10},${Math.round(pt.y * 10) / 10}`;
  });
  const indiaSvgPath = `M ${indiaPathPoints.join(' L ')} Z`;

  // Pan and drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Click on a facility dot
  const handleFacilityClick = (fac: Facility, e: React.MouseEvent) => {
    e.stopPropagation();
    setInspectedFacility(fac);
    setInspectedRegion(null);
    onSelectFacility(fac);
    const parentReg = safeRegions.find((r) => r.id === fac.regionId);
    if (parentReg) onSelectRegion(parentReg);
  };

  // Click on a region centroid/bubble
  const handleRegionClick = (reg: Region, e: React.MouseEvent) => {
    e.stopPropagation();
    setInspectedRegion(reg);
    setInspectedFacility(null);
    onSelectRegion(reg);
    const firstFac = safeFacilities.find((f) => f.regionId === reg.id);
    if (firstFac) onSelectFacility(firstFac);
  };

  // Filter facilities by search query
  const displayedFacilities = safeFacilities.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.sector.toLowerCase().includes(q) ||
      f.state.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="relative w-full h-[650px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      {/* Top Map Toolbar: Layer Toggles & Search */}
      <div className="absolute top-3 left-3 right-16 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Layer Toggles Pill Container */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl text-xs shadow-lg">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-2">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Layers:
          </span>
          <button
            onClick={() => toggleLayer('facilities')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeLayers.facilities
                ? 'bg-emerald-800 text-emerald-100 border border-emerald-600 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Facilities ({safeFacilities.length})
          </button>
          <button
            onClick={() => toggleLayer('riskZones')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeLayers.riskZones
                ? 'bg-rose-900/80 text-rose-100 border border-rose-700 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Risk Corridors
          </button>
          <button
            onClick={() => toggleLayer('airPollution')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeLayers.airPollution
                ? 'bg-amber-900/80 text-amber-100 border border-amber-700 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Wind className="w-3 h-3 text-amber-400" />
            Air Basins (AQI)
          </button>
          <button
            onClick={() => toggleLayer('waterStress')}
            className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-colors flex items-center gap-1.5 ${
              activeLayers.waterStress
                ? 'bg-sky-900/80 text-sky-100 border border-sky-700 shadow-xs'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Droplets className="w-3 h-3 text-sky-400" />
            Watershed Stress
          </button>
        </div>

        {/* Search Bar on Map */}
        <div className="relative flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-2.5 py-1 text-xs shadow-lg">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <input
            type="text"
            placeholder="Search facility or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-hidden w-36 sm:w-44 text-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 flex flex-col gap-1 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legend */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-[11px] shadow-lg text-slate-300 w-36">
          <div className="font-bold text-slate-400 uppercase tracking-wider mb-2 text-[10px] flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" />
            Impact Severity
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-xs shadow-rose-500/50" />
              <span className="font-medium text-slate-200">Critical (81 - 100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50" />
              <span className="font-medium text-slate-200">High (61 - 80)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="font-medium text-slate-200">Moderate (31 - 60)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-slate-200">Low (0 - 30)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="flex-1 w-full h-full overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 800 860"
          className="w-full h-full max-h-[610px] select-none transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          }}
        >
          <defs>
            {/* Gradients for regional impact zones */}
            <radialGradient id="grad-critical" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="grad-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="grad-moderate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            {/* Ocean texture */}
            <pattern id="ocean-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.3" />
            </pattern>

            <filter id="glow-marker" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="shadow-halo" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Ocean Background Area */}
          <rect x="0" y="0" width="800" height="860" fill="#030712" />
          <rect x="0" y="0" width="800" height="860" fill="url(#ocean-grid)" />

          {/* Indian Ocean & Arabian Sea & Bay of Bengal Water Labels */}
          <text x="140" y="660" fill="#334155" fontSize="11" fontFamily="sans-serif" fontWeight="600" letterSpacing="2">
            ARABIAN SEA
          </text>
          <text x="560" y="600" fill="#334155" fontSize="11" fontFamily="sans-serif" fontWeight="600" letterSpacing="2">
            BAY OF BENGAL
          </text>
          <text x="320" y="840" fill="#334155" fontSize="11" fontFamily="sans-serif" fontWeight="600" letterSpacing="2">
            INDIAN OCEAN
          </text>

          {/* Geographic Coordinates Grid (Latitude & Longitude Graticules) */}
          <g className="graticules" opacity="0.12">
            {/* Longitude lines: 70°E, 75°E, 80°E, 85°E, 90°E, 95°E */}
            {[70, 75, 80, 85, 90, 95].map((lng) => {
              const { x } = projectCoords(20, lng);
              return (
                <g key={`lng-${lng}`}>
                  <line x1={x} y1="0" x2={x} y2="860" stroke="#38bdf8" strokeDasharray="3 3" />
                  <text x={x + 3} y="850" fill="#64748b" fontSize="8" fontFamily="monospace">
                    {lng}°E
                  </text>
                </g>
              );
            })}
            {/* Latitude lines: 10°N, 15°N, 20°N, 25°N, 30°N, 35°N */}
            {[10, 15, 20, 25, 30, 35].map((lat) => {
              const { y } = projectCoords(lat, 80);
              return (
                <g key={`lat-${lat}`}>
                  <line x1="0" y1={y} x2="800" y2={y} stroke="#38bdf8" strokeDasharray="3 3" />
                  <text x="8" y={y - 4} fill="#64748b" fontSize="8" fontFamily="monospace">
                    {lat}°N
                  </text>
                </g>
              );
            })}
          </g>

          {/* Exterior Coastal Glow / Buffer Boundary */}
          <path
            d={indiaSvgPath}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="8"
            strokeOpacity="0.08"
            strokeLinejoin="round"
          />
          <path
            d={indiaSvgPath}
            fill="none"
            stroke="#0284c7"
            strokeWidth="4"
            strokeOpacity="0.18"
            strokeLinejoin="round"
          />

          {/* Accurate India Mainland Landmass */}
          <path
            d={indiaSvgPath}
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.8"
            strokeLinejoin="round"
            className="transition-colors duration-200"
          />

          {/* Subtle Internal Zonal Boundary Lines */}
          <g className="zonal-boundaries" opacity="0.3" stroke="#475569" strokeWidth="0.8" strokeDasharray="2 3">
            {/* Northern to Central divider */}
            <path d="M 180,310 Q 280,330 400,340 T 540,360" fill="none" />
            {/* Central to Western divider */}
            <path d="M 230,360 Q 270,440 280,520" fill="none" />
            {/* Central to Eastern divider */}
            <path d="M 430,340 Q 450,420 470,490" fill="none" />
            {/* Southern Peninsula entrance */}
            <path d="M 200,530 Q 300,560 410,540" fill="none" />
            {/* Northeast corridor bridge */}
            <path d="M 520,290 Q 560,300 580,340" fill="none" />
          </g>

          {/* Andaman and Nicobar Islands Archipelago */}
          <g className="andaman-nicobar">
            {ANDAMAN_ISLANDS.map((island) => {
              const { x, y } = projectCoords(island.lat, island.lng);
              return (
                <g key={island.name} className="group">
                  <ellipse
                    cx={x}
                    cy={y}
                    rx={island.rx}
                    ry={island.ry}
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.2"
                  />
                  <ellipse
                    cx={x}
                    cy={y}
                    rx={island.rx - 1}
                    ry={island.ry - 1}
                    fill="#1e293b"
                  />
                </g>
              );
            })}
            <text x="680" y="680" fill="#475569" fontSize="8" fontFamily="sans-serif" fontWeight="500">
              Andaman & Nicobar Islands
            </text>
          </g>

          {/* Lakshadweep Archipelago */}
          <g className="lakshadweep">
            {LAKSHADWEEP_ISLANDS.map((island) => {
              const { x, y } = projectCoords(island.lat, island.lng);
              return (
                <ellipse
                  key={island.name}
                  cx={x}
                  cy={y}
                  rx={island.rx}
                  ry={island.ry}
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}
            <text x="90" y="700" fill="#475569" fontSize="8" fontFamily="sans-serif" fontWeight="500">
              Lakshadweep
            </text>
          </g>

          {/* LAYER: Risk Corridors & Environmental Heat Halo Zones */}
          {activeLayers.riskZones &&
            safeRegions.map((region) => {
              const { x, y } = projectCoords(region.coordinates.lat, region.coordinates.lng);
              const gradId =
                region.riskLevel === 'CRITICAL'
                  ? 'grad-critical'
                  : region.riskLevel === 'HIGH'
                  ? 'grad-high'
                  : 'grad-moderate';

              const radius = region.riskLevel === 'CRITICAL' ? 64 : region.riskLevel === 'HIGH' ? 52 : 40;
              const isInspected = inspectedRegion?.id === region.id;

              return (
                <g
                  key={`heat-${region.id}`}
                  onClick={(e) => handleRegionClick(region, e)}
                  className="cursor-pointer group"
                >
                  {/* Heatmap blur radius */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={`url(#${gradId})`}
                    className="transition-all duration-300"
                  />

                  {/* Concentric risk pulse ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius * 0.7}
                    fill="none"
                    stroke={getRiskColor(region.riskLevel)}
                    strokeWidth={isInspected ? '2' : '1'}
                    strokeDasharray="4 4"
                    opacity={isInspected ? '0.9' : '0.45'}
                  />

                  {/* Centroid label dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={getRiskColor(region.riskLevel)}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />

                  {/* Region Name Tag */}
                  <text
                    x={x}
                    y={y + radius * 0.7 + 12}
                    textAnchor="middle"
                    fill={isInspected ? '#ffffff' : '#94a3b8'}
                    fontSize="9.5"
                    fontFamily="sans-serif"
                    fontWeight={isInspected ? '700' : '600'}
                    className="transition-colors drop-shadow-md"
                  >
                    {region.name.split(' ')[0]}
                  </text>
                  <text
                    x={x}
                    y={y + radius * 0.7 + 22}
                    textAnchor="middle"
                    fill={getRiskColor(region.riskLevel)}
                    fontSize="8.5"
                    fontWeight="700"
                  >
                    Score: {region.avgImpactScore}
                  </text>
                </g>
              );
            })}

          {/* LAYER: Air Pollution / AQI Stress Indicators */}
          {activeLayers.airPollution &&
            safeRegions.map((region) => {
              const { x, y } = projectCoords(region.coordinates.lat, region.coordinates.lng);
              const aqiVal = region.airQualityIndex;
              if (aqiVal > 150) {
                return (
                  <circle
                    key={`aqi-${region.id}`}
                    cx={x + 12}
                    cy={y - 12}
                    r="18"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                    opacity="0.5"
                  />
                );
              }
              return null;
            })}

          {/* LAYER: Watershed Stress Indicators */}
          {activeLayers.waterStress &&
            safeRegions
              .filter((r) => r.waterStressLevel === 'Severe' || r.waterStressLevel === 'High')
              .map((region) => {
                const { x, y } = projectCoords(region.coordinates.lat, region.coordinates.lng);
                return (
                  <circle
                    key={`water-${region.id}`}
                    cx={x - 14}
                    cy={y + 12}
                    r="20"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                    opacity="0.6"
                  />
                );
              })}

          {/* LAYER: Industrial Facilities Markers (The Clickable Dots) */}
          {activeLayers.facilities &&
            displayedFacilities.map((fac) => {
              const { x, y } = projectCoords(fac.coordinates.lat, fac.coordinates.lng);
              const isSelected = selectedFacility?.id === fac.id || inspectedFacility?.id === fac.id;
              const color = getRiskColor(fac.riskLevel);

              return (
                <g
                  key={fac.id}
                  onClick={(e) => handleFacilityClick(fac, e)}
                  onMouseEnter={() => setHoveredFacility(fac)}
                  onMouseLeave={() => setHoveredFacility(null)}
                  className="cursor-pointer group"
                >
                  {/* Pulsing ring for critical facility */}
                  {fac.riskLevel === 'CRITICAL' && (
                    <circle
                      cx={x}
                      cy={y}
                      r="14"
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      opacity="0.7"
                    >
                      <animate
                        attributeName="r"
                        values="8;17;8"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Active selection halo */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="16"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      opacity="0.9"
                    />
                  )}

                  {/* Facility Dot Target (Enlarged hit area) */}
                  <circle cx={x} cy={y} r="18" fill="transparent" />

                  {/* Visible Marker Pin */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 7.5 : 5.5}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    filter="url(#glow-marker)"
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Inner center dot */}
                  <circle cx={x} cy={y} r="2" fill="#ffffff" />
                </g>
              );
            })}
        </svg>
      </div>

      {/* Instant Hover Tooltip */}
      {hoveredFacility && !inspectedFacility && (
        <div className="absolute bottom-4 left-4 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl max-w-sm text-xs pointer-events-none transition-all">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-white leading-tight">{hoveredFacility.name}</span>
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: getRiskColor(hoveredFacility.riskLevel) }}
            >
              {hoveredFacility.impactScore}/100 • {hoveredFacility.riskLevel}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mb-2">
            Sector: <span className="text-slate-200 font-medium">{hoveredFacility.sector}</span> • {hoveredFacility.regionName} ({hoveredFacility.state})
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-300">
            <div>CO2: <span className="text-slate-100 font-semibold">{hoveredFacility.emissionsCO2kTonnes} kt</span></div>
            <div>SO2: <span className="text-slate-100 font-semibold">{hoveredFacility.emissionsSO2Tonnes} t</span></div>
            <div>Renewable: <span className="text-emerald-400 font-semibold">{hoveredFacility.renewableSharePct}%</span></div>
            <div>Water: <span className="text-sky-400 font-semibold">{hoveredFacility.waterAnnualMillionLitres} ML</span></div>
          </div>
          <div className="mt-2 text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <span>Click dot for deep parameter telemetry & mitigation dossier</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE CLICK INSPECTOR MODAL / OVERLAY FOR ANY CLICKED FACILITY */}
      {/* ========================================================================= */}
      {inspectedFacility && (
        <div className="absolute inset-x-3 bottom-3 sm:top-auto z-40 bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-5 text-slate-200 pointer-events-auto max-h-[85%] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-3">
            <div className="flex items-start gap-3">
              <div
                className="w-4 h-4 rounded-full mt-1 shrink-0"
                style={{ backgroundColor: getRiskColor(inspectedFacility.riskLevel) }}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-white">{inspectedFacility.name}</h3>
                  <span className="font-mono text-xs text-slate-400">({inspectedFacility.code})</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {inspectedFacility.sector}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: getRiskColor(inspectedFacility.riskLevel) }}
                  >
                    {inspectedFacility.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {inspectedFacility.regionName}, {inspectedFacility.state} • Coordinates: {inspectedFacility.coordinates.lat}°N, {inspectedFacility.coordinates.lng}°E • Status: {inspectedFacility.operationalStatus}
                </p>
              </div>
            </div>

            <button
              onClick={() => setInspectedFacility(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title="Close Details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Details Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3.5 text-xs">
            {/* Column 1: Composite Impact Score & Component Breakdown */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  Composite Impact Score
                </span>
                <span
                  className="text-lg font-mono font-black"
                  style={{ color: getRiskColor(inspectedFacility.riskLevel) }}
                >
                  {inspectedFacility.impactScore}/100
                </span>
              </div>

              {/* Sub-Vector Component Bars */}
              <div className="space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Stack Emissions</span>
                    <span className="font-mono font-semibold text-rose-400">{inspectedFacility.emissionScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${inspectedFacility.emissionScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Air Pollution (Ambient AQI)</span>
                    <span className="font-mono font-semibold text-amber-400">{inspectedFacility.pollutionScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${inspectedFacility.pollutionScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Water & Resource Stress</span>
                    <span className="font-mono font-semibold text-sky-400">{inspectedFacility.resourceScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: `${inspectedFacility.resourceScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">Energy Intensity</span>
                    <span className="font-mono font-semibold text-emerald-400">{inspectedFacility.energyScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${inspectedFacility.energyScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Stack Telemetry & Environmental Mass Flow */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-sky-400" />
                Stack & Resource Telemetry
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">CO2 Total</span>
                  <span className="font-mono font-bold text-slate-100 text-xs">
                    {inspectedFacility.emissionsCO2kTonnes.toLocaleString()} kTonnes
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">SO2 Emissions</span>
                  <span className="font-mono font-bold text-rose-400 text-xs">
                    {inspectedFacility.emissionsSO2Tonnes.toLocaleString()} t
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">NO2 Emissions</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">
                    {inspectedFacility.emissionsNO2Tonnes.toLocaleString()} t
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PM2.5 Mass</span>
                  <span className="font-mono font-bold text-orange-400 text-xs">
                    {inspectedFacility.emissionsPM25Tonnes} t
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Water Withdrawal</span>
                  <span className="font-mono font-bold text-sky-400 text-xs">
                    {inspectedFacility.waterAnnualMillionLitres.toLocaleString()} ML
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">Renewable Share</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {inspectedFacility.renewableSharePct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Production Capacity & Strategic Actions */}
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                <span className="font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Industrial Context & Output
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400">Annual Production:</span>{' '}
                    <strong className="text-slate-100">{inspectedFacility.productionAnnual.toLocaleString()} {inspectedFacility.productionUnit}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Capacity Utilization:</span>{' '}
                    <strong className="text-slate-100">{inspectedFacility.capacityUtilization}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Water Recycled Rate:</span>{' '}
                    <strong className="text-sky-400">{inspectedFacility.waterRecycledPct}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Waste Circularity:</span>{' '}
                    <strong className="text-emerald-400">{inspectedFacility.wasteRecycledPct}%</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {onViewFacilityDetail && (
                  <button
                    onClick={() => onViewFacilityDetail(inspectedFacility)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Inspect Complete Facility Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onNavigateToSimulator && (
                  <button
                    onClick={() => onNavigateToSimulator(inspectedFacility)}
                    className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                  >
                    <span>Simulate Emission Mitigation Levers</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE CLICK INSPECTOR MODAL / OVERLAY FOR ANY CLICKED REGION */}
      {/* ========================================================================= */}
      {inspectedRegion && (
        <div className="absolute inset-x-3 bottom-3 z-40 bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-200 pointer-events-auto max-h-[85%] overflow-y-auto">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{inspectedRegion.name}</h3>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: getRiskColor(inspectedRegion.riskLevel) }}
                >
                  {inspectedRegion.riskLevel} RISK
                </span>
                <span className="text-xs text-slate-400">{inspectedRegion.state}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Area: {inspectedRegion.areaSqKm?.toLocaleString()} km² • Population: {inspectedRegion.populationMillion}M • Dominant Factor: {inspectedRegion.dominantRiskDriver}
              </p>
            </div>

            <button
              onClick={() => setInspectedRegion(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Vulnerability Index</span>
              <strong className="text-base font-mono font-bold text-rose-400">
                {inspectedRegion.avgImpactScore}/100
              </strong>
            </div>
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Air Quality Index (AQI)</span>
              <strong className="text-base font-mono font-bold text-amber-400">
                {inspectedRegion.airQualityIndex}
              </strong>
            </div>
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Water Stress Level</span>
              <strong className="text-base font-bold text-sky-400">
                {inspectedRegion.waterStressLevel}
              </strong>
            </div>
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Forest & Canopy Cover</span>
              <strong className="text-base font-bold text-emerald-400">
                {inspectedRegion.forestCoverPct}%
              </strong>
            </div>
          </div>

          {/* Monitored Facilities in this Region */}
          <div className="mt-3 pt-3 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Monitored Industrial Facilities in {inspectedRegion.name}:
            </span>
            <div className="flex flex-wrap gap-2">
              {safeFacilities
                .filter((f) => f.regionId === inspectedRegion.id)
                .map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => {
                      setInspectedFacility(fac);
                      setInspectedRegion(null);
                      onSelectFacility(fac);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getRiskColor(fac.riskLevel) }}
                    />
                    <span>{fac.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({fac.impactScore}/100)</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom status bar if no modal is open */}
      {!inspectedFacility && !inspectedRegion && selectedFacility && (
        <div className="p-2.5 px-4 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs z-10 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getRiskColor(selectedFacility.riskLevel) }}
            />
            <span className="font-semibold text-white">{selectedFacility.name}</span>
            <span className="text-slate-400">({selectedFacility.code})</span>
            <span className="text-slate-300">
              Score: <strong className="text-white">{selectedFacility.impactScore}/100</strong> ({selectedFacility.riskLevel})
            </span>
          </div>
          <button
            onClick={() => setInspectedFacility(selectedFacility)}
            className="text-emerald-400 hover:text-emerald-300 font-medium text-xs flex items-center gap-1"
          >
            <span>Open Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
