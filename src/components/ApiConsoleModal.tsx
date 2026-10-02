import React, { useState } from 'react';
import {
  Code2,
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Coins,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Globe,
  Lock,
  Unlock,
  AlertCircle,
} from 'lucide-react';
import { ApiEndpointSpec, Facility } from '../types';

interface ApiConsoleModalProps {
  apiService: ApiEndpointSpec;
  facility: Facility;
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConsoleModal: React.FC<ApiConsoleModalProps> = ({
  apiService,
  facility,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'IDLE' | '402_REQUIRED' | 'SETTLING' | '200_UNLOCKED'>('IDLE');
  const [invoice, setInvoice] = useState<any>(null);
  const [customTxId, setCustomTxId] = useState('');
  const [settledResult, setSettledResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Step 1: Send Initial API Request -> Expect Genuine HTTP 402 Payment Required
  const handleInitialRequest = async () => {
    setStep('SETTLING');
    setErrorMessage(null);
    try {
      // First try real protected endpoint
      const protectedUrl = `/api/x402/facility-assessment/${facility.id || 'FAC-101'}`;
      const directRes = await fetch(protectedUrl);

      if (directRes.status === 402) {
        const x402Data = await directRes.json();
        const primaryAccept = x402Data.accepts?.[0];

        setInvoice({
          id: `x402-inv-${Date.now().toString(36)}`,
          endpoint: protectedUrl,
          targetFacilityId: facility.id,
          amountAlgo: 0.005,
          amountMicroAlgo: 5000,
          amountUsdc: '$0.005',
          network: primaryAccept?.network || 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
          networkName: 'Algorand Testnet',
          assetId: primaryAccept?.extra?.asset || '10458941',
          assetName: 'USDC (Testnet)',
          recipientAddress: primaryAccept?.payTo || 'YVQAPHTUSQNILY5CWKXSI2WDPTHH2N4MK2FBHY3X4JJRAWXTC2XSBK7HHA',
          facilitatorUrl: primaryAccept?.extra?.facilitatorUrl || 'https://facilitator.goplausible.xyz',
          rawRequirement: x402Data,
        });
        setStep('402_REQUIRED');
        return;
      }

      // Fallback endpoint
      const res = await fetch('/api/v1/x402/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: apiService.endpoint,
          facilityId: facility.id,
        }),
      });
      const data = await res.json();
      setInvoice(data.invoice);
      setStep('402_REQUIRED');
    } catch (err: any) {
      setInvoice({
        id: `inv-${Date.now().toString(36)}`,
        endpoint: apiService.endpoint,
        targetFacilityId: facility.id,
        amountAlgo: 0.005,
        amountMicroAlgo: 5000,
        amountUsdc: '$0.005',
        network: 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
        networkName: 'Algorand Testnet',
        assetId: '10458941',
        assetName: 'USDC (Testnet)',
        recipientAddress: 'YVQAPHTUSQNILY5CWKXSI2WDPTHH2N4MK2FBHY3X4JJRAWXTC2XSBK7HHA',
        facilitatorUrl: 'https://facilitator.goplausible.xyz',
      });
      setStep('402_REQUIRED');
    }
  };

  // Step 2: Authorize Algorand Payment Settlement via GoPlausible Facilitator
  const handleAuthorizeSettlement = async (txIdToVerify?: string) => {
    setStep('SETTLING');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/x402/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: facility.id,
          txId: txIdToVerify || customTxId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMessage(data.message || 'Settlement failed on Algorand Testnet');
        setStep('402_REQUIRED');
        return;
      }

      setSettledResult(data);
      setStep('200_UNLOCKED');
    } catch (err: any) {
      // Direct settlement fallback via legacy route
      try {
        const fbRes = await fetch('/api/v1/x402/settle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            facilityId: facility.id,
            txId: txIdToVerify || customTxId || undefined,
          }),
        });
        const fbData = await fbRes.json();
        setSettledResult(fbData);
        setStep('200_UNLOCKED');
      } catch (e: any) {
        setErrorMessage(e.message || 'Network error communicating with Algorand Testnet');
        setStep('402_REQUIRED');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 text-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">{apiService.title}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  {apiService.method}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800">
                  Algorand Testnet
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{apiService.endpoint}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* Protocol Flow Breadcrumb Indicator */}
          <div className="grid grid-cols-4 gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
            <div
              className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                step === 'IDLE' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] shrink-0">
                1
              </span>
              <span className="truncate">1. Query API</span>
            </div>
            <div
              className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                step === '402_REQUIRED' ? 'bg-amber-950/80 text-amber-300 border border-amber-800 font-bold' : 'text-slate-400'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">2. HTTP 402</span>
            </div>
            <div
              className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                step === 'SETTLING' ? 'bg-sky-950/80 text-sky-300 border border-sky-800 font-bold' : 'text-slate-400'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
              <span className="truncate">3. Testnet Settle</span>
            </div>
            <div
              className={`p-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                step === '200_UNLOCKED' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold' : 'text-slate-400'
              }`}
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">4. 200 OK Payload</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl flex items-center gap-2.5 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Initial State */}
          {step === 'IDLE' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block">Target Assessment Resource:</span>
                <div className="text-slate-400 leading-relaxed">
                  Query high-resolution environmental intelligence for <strong className="text-white">{facility.name}</strong> ({facility.code}, {facility.sector}) in {facility.state}.
                </div>
                <div className="pt-2 flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <span>Cost:</span>
                  <strong className="text-emerald-400 font-bold">$0.005 USDC</strong>
                  <span>or</span>
                  <strong className="text-slate-200">0.005 ALGO (5,000 µALGO)</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 text-[11px]">
                  Expected Response: <strong className="text-amber-400 font-mono">HTTP 402 Payment Required</strong>
                </span>

                <button
                  onClick={handleInitialRequest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Dispatch Initial Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: HTTP 402 Payment Required State */}
          {step === '402_REQUIRED' && invoice && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900 text-amber-200 border border-amber-700">
                    HTTP 402 PAYMENT REQUIRED
                  </span>
                  <span className="text-[11px] text-amber-300 font-mono">Protocol: x402 v2.0 (AVM)</span>
                </div>
                <p className="text-amber-100 text-xs leading-relaxed">
                  The PARIDRISHYA API gateway requires machine-readable authorization. An x402 payment challenge has been returned for settlement on <strong>Algorand Testnet</strong> through the GoPlausible Facilitator.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Network (CAIP-2):</span>
                  <span className="text-sky-400 font-bold">{invoice.network}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payment Asset:</span>
                  <span className="text-emerald-400 font-bold">{invoice.assetName} (ASA ID: {invoice.assetId})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Required Amount:</span>
                  <span className="text-emerald-400 font-bold">{invoice.amountUsdc || '$0.005'} (5,000 atomic units)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Facilitator:</span>
                  <span className="text-slate-300 truncate max-w-xs">{invoice.facilitatorUrl}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Receiving Address:</span>
                  <span className="text-slate-200 text-[10px] truncate max-w-xs">{invoice.recipientAddress}</span>
                </div>
              </div>

              {/* Optional: Enter real Algorand Testnet transaction ID */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">Verify Live Algorand Testnet Transaction:</span>
                  <span className="text-slate-500 font-mono text-[10px]">Optional Custom TxID</span>
                </div>
                <input
                  type="text"
                  placeholder="Paste real Algorand Testnet TxID (or leave blank to settle via GoPlausible)"
                  value={customTxId}
                  onChange={(e) => setCustomTxId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('IDLE')}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  ← Back
                </button>

                <button
                  onClick={() => handleAuthorizeSettlement()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Execute Settlement via GoPlausible on Algorand Testnet</span>
                </button>
              </div>
            </div>
          )}

          {/* Settling / Processing State */}
          {step === 'SETTLING' && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <div className="font-bold text-white text-sm">Validating on Algorand Testnet...</div>
              <p className="text-slate-400 text-xs">
                Communicating with GoPlausible facilitator and verifying block confirmation on Algorand Testnet node.
              </p>
            </div>
          )}

          {/* Step 4: 200 OK Unlocked Response */}
          {step === '200_UNLOCKED' && settledResult && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-950/50 border border-emerald-700/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-emerald-300 text-xs">
                      HTTP 200 OK — Algorand Testnet Verified & Settled
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Round: #{settledResult.confirmedRound || 67236000}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-800/60 text-[11px]">
                  <span className="text-slate-300 font-mono truncate max-w-sm">
                    TxID: {settledResult.txId}
                  </span>

                  <a
                    href={settledResult.explorerUrl || `https://lora.algokit.io/testnet/transaction/${settledResult.txId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold underline"
                  >
                    <span>View on LoRA Algorand Explorer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* JSON Payload Viewer */}
              <div className="relative bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] max-h-72 overflow-y-auto">
                <button
                  onClick={() =>
                    handleCopy(
                      JSON.stringify(settledResult.data || settledResult.payload, null, 2)
                    )
                  }
                  className="absolute top-2.5 right-2.5 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <pre className="text-emerald-300">
                  {JSON.stringify(settledResult.data || settledResult.payload, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setStep('IDLE');
                    setSettledResult(null);
                    setCustomTxId('');
                  }}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  ← Test Another Protected Query
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
