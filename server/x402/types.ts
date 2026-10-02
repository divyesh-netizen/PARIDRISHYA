export interface X402PaymentAccept {
  scheme: 'exact';
  price: string;
  network: string; // CAIP-2 e.g. 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='
  payTo: string;
  extra: {
    asset: string; // ASA ID e.g. '10458941' (USDC Testnet) or '0' (ALGO)
    assetName: string;
    decimals: number;
    amountAtomic: string;
    facilitatorUrl: string;
    feePayer?: string;
  };
}

export interface X402PaymentRequirement {
  x402Version: 2;
  error: string;
  message: string;
  accepts: X402PaymentAccept[];
  resource: {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    pricing: {
      usdc: string;
      microAlgo?: number;
    };
  };
}

export interface X402SettlementVerification {
  valid: boolean;
  status: 'VERIFIED_SETTLED' | 'REJECTED' | 'PENDING';
  txId?: string;
  network: string;
  assetId: string;
  amountAtomic: string;
  senderAddress?: string;
  receiverAddress: string;
  confirmedRound?: number;
  facilitator: string;
  facilitatorResponse?: any;
  verifiedAt: string;
  error?: string;
}

export interface UnlockedEnvironmentalIntelligence {
  facilityId: string;
  facilityName: string;
  sector: string;
  regionName: string;
  state: string;
  coordinates: { lat: number; lng: number };
  impactScore: number;
  riskLevel: string;
  components: {
    emissionScore: number;
    pollutionScore: number;
    resourceScore: number;
    energyScore: number;
    environmentalStressScore: number;
    climateRiskScore: number;
  };
  metrics: {
    emissionsCO2kTonnes: number;
    emissionsSO2Tonnes: number;
    emissionsNO2Tonnes: number;
    emissionsPM25Tonnes: number;
    emissionsPM10Tonnes: number;
    waterAnnualMillionLitres: number;
    waterRecycledPct: number;
    renewableSharePct: number;
  };
  contributingFactors: Array<{ name: string; percentage: number; color: string }>;
  recommendations: Array<{ priority: string; title: string; reductionPct: number; capexEstimate: string }>;
  forecastSummary: string;
  licenseToken: string;
  generatedAt: string;
}
