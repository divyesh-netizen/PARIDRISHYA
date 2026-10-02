import React, { useState } from 'react';
import {
  Code2,
  Coins,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { ApiEndpointSpec, Facility } from '../types';
import { ApiConsoleModal } from '../components/ApiConsoleModal';
import { PageHeader, Button, Card } from '../components/common/DesignSystem';

interface IntelligenceApiPageProps {
  apiSpecs: ApiEndpointSpec[];
  facilities: Facility[];
}

export const IntelligenceApiPage: React.FC<IntelligenceApiPageProps> = ({
  apiSpecs = [],
  facilities = [],
}) => {
  const [selectedSpec, setSelectedSpec] = useState<ApiEndpointSpec | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const safeFacilities = facilities || [];
  const safeSpecs = apiSpecs || [];
  const defaultFacility = safeFacilities[0] || ({} as Facility);

  const handleOpenSandbox = (spec: ApiEndpointSpec) => {
    setSelectedSpec(spec);
    setIsModalOpen(true);
  };

  const handleCopyCurl = (endpoint: string, id: string) => {
    const curl = `curl -X GET https://paridrishya.gov.in${endpoint.replace(':facilityId', defaultFacility.id || 'FAC-001')}`;
    navigator.clipboard.writeText(curl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Institutional Page Header */}
      <PageHeader
        category="M2M INTEGRATION & GATEWAY"
        badge="x402 PROTOCOL"
        title="Environmental Intelligence API & x402 Settlement Gateway"
        subtitle="Query explainable impact scores, 10-year forecasts, and regional stress indicators programmatically via HTTP 402 pay-per-use micropayments."
        icon={Code2}
        actions={
          <div className="flex items-center gap-2 text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium">Network:</span>
            <span className="font-mono font-bold text-slate-800">Algorand Testnet</span>
          </div>
        }
      />

      {/* Protocol Explanation Architecture */}
      <div className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Coins className="w-4.5 h-4.5 text-emerald-800" />
          <h3 className="text-sm font-bold text-slate-900">
            How x402 Micropayment Programmable Access Works
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Traditional SaaS APIs lock data behind opaque recurring enterprise subscriptions. PARIDRISHYA implements the <strong>x402 standard</strong>: clients query high-resolution environmental intelligence on-demand. If an unauthenticated or public client requests compute-intensive model forecasts, the API responds with <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">HTTP 402 Payment Required</code> containing an Algorand invoice. Upon cryptographic transaction proof verification, the payload is unlocked in milliseconds.
        </p>

        {/* 4-Step Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-0.5">1. Client Request</span>
            <span className="text-slate-500 font-mono text-[10px]">HTTP GET /api/v1/impact/:id</span>
          </div>
          <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs">
            <span className="font-bold text-amber-950 block mb-0.5">2. HTTP 402 Invoice</span>
            <span className="text-amber-850 text-[10px]">Returns micro-ALGO cost & address</span>
          </div>
          <div className="p-3 bg-sky-50/80 rounded-lg border border-sky-200 text-xs">
            <span className="font-bold text-sky-950 block mb-0.5">3. Algorand Settle</span>
            <span className="text-sky-850 text-[10px]">Atomic payment on-chain & proof</span>
          </div>
          <div className="p-3 bg-emerald-50/80 rounded-lg border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-950 block mb-0.5">4. 200 OK Response</span>
            <span className="text-emerald-850 text-[10px]">Delivers verified environmental JSON</span>
          </div>
        </div>
      </div>

      {/* API Endpoints Catalog */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs">
          <h3 className="text-sm font-bold text-slate-900">
            Published Environmental Intelligence Endpoints ({safeSpecs.length})
          </h3>
          <span className="text-slate-500 font-mono text-[11px]">Standard OpenAPI 3.1 compatible</span>
        </div>

        {safeSpecs.map((spec) => (
          <div
            key={spec.endpoint}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                  {spec.method}
                </span>
                <span className="font-mono text-xs font-bold text-slate-900">{spec.endpoint}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-500">
                  <span>Cost: </span>
                  <strong className="text-slate-900 font-mono">
                    {spec.costMicroAlgo / 1000000} ALGO (~₹{spec.costInr})
                  </strong>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenSandbox(spec)}
                  icon={Terminal}
                >
                  Try in Sandbox
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {spec.description}
            </p>

            {/* Curl Command Snippet */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="truncate pr-4 text-emerald-400 text-[11px]">
                curl -X {spec.method} https://paridrishya.gov.in{spec.endpoint.replace(':facilityId', defaultFacility.id)}
              </span>
              <button
                onClick={() => handleCopyCurl(spec.endpoint, spec.endpoint)}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors shrink-0 cursor-pointer"
                title="Copy Curl Command"
              >
                {copiedId === spec.endpoint ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sandbox Test Modal */}
      {isModalOpen && selectedSpec && (
        <ApiConsoleModal
          apiService={selectedSpec}
          facility={defaultFacility}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
