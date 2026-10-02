import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { MOCK_FACILITIES, MOCK_REGIONS, MOCK_ALERTS, MOCK_DATA_SOURCES, MOCK_API_SERVICES } from './src/data/mockData.ts';
import {
  calculateContributingFactors,
  generateExplainabilitySummary,
  generateRecommendations,
  generateFacilityTrends,
  calculateScenario,
} from './src/utils/calculations.ts';
import { SUPABASE_SQL_SCHEMA } from './src/utils/supabaseSchema.ts';
import { x402Router } from './server/x402/routes.ts';
import { X402FacilitatorService } from './server/x402/facilitator.ts';
import {
  PARIDRISHYA_AVM_ADDRESS,
  ALGORAND_TESTNET_CAIP2,
  USDC_TESTNET_ASA_ID,
  FACILITATOR_URL,
} from './server/x402/payment-config.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Optional Gemini client initialization (lazy / safe)
  let genAiClient: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      genAiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch {
      console.warn('Gemini client failed to initialize, will use deterministic engine.');
    }
  }

  // --------------------------------------------------------------------------
  // REST API ENDPOINTS
  // --------------------------------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      service: 'PARIDRISHYA Environmental Intelligence Engine',
      version: '1.4.0',
      demoMode: true,
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL / Supabase Ready (Deterministic Hybrid)',
      geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // System Status
  app.get('/api/system-status', (req, res) => {
    res.json({
      databaseStatus: 'Operational (20 Normalized Tables Ready)',
      apiStatus: 'Operational',
      dataPipeline: 'Active (8 Ingestion Streams)',
      lastIngestion: '2026-09-12 05:30 IST',
      facilitiesMonitored: MOCK_FACILITIES.length,
      regionsCovered: MOCK_REGIONS.length,
      forecastEngine: 'Operational (Damped Polynomial v2)',
      x402SettlementLayer: 'Operational (Algorand Testnet Sandbox)',
      supabaseSyncStatus: 'Connected Schema Standby',
      dataQualityScore: 94.8,
    });
  });

  // Facilities list with filtering & search
  app.get('/api/facilities', (req, res) => {
    const { search, sector, region, risk } = req.query;
    let filtered = [...MOCK_FACILITIES];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.code.toLowerCase().includes(q) ||
          f.state.toLowerCase().includes(q) ||
          f.sector.toLowerCase().includes(q)
      );
    }

    if (sector && typeof sector === 'string' && sector !== 'ALL') {
      filtered = filtered.filter((f) => f.sector === sector);
    }

    if (region && typeof region === 'string' && region !== 'ALL') {
      filtered = filtered.filter((f) => f.regionId === region || f.regionName === region);
    }

    if (risk && typeof risk === 'string' && risk !== 'ALL') {
      filtered = filtered.filter((f) => f.riskLevel === risk);
    }

    res.json({
      count: filtered.length,
      totalFacilities: MOCK_FACILITIES.length,
      facilities: filtered,
    });
  });

  // Facility detail with explainability & recommendations
  app.get('/api/facilities/:id', (req, res) => {
    const facility = MOCK_FACILITIES.find((f) => f.id === req.params.id || f.code === req.params.id);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    const contributingFactors = calculateContributingFactors(facility);
    const recommendations = generateRecommendations(facility);
    const explainability = generateExplainabilitySummary(facility);
    const trends = generateFacilityTrends(facility);

    res.json({
      facility,
      contributingFactors,
      recommendations,
      explainability,
      trends,
    });
  });

  // Regions list
  app.get('/api/regions', (req, res) => {
    res.json({
      count: MOCK_REGIONS.length,
      regions: MOCK_REGIONS,
    });
  });

  // Region detail with associated facilities
  app.get('/api/regions/:id', (req, res) => {
    const region = MOCK_REGIONS.find((r) => r.id === req.params.id);
    if (!region) {
      return res.status(404).json({ error: 'Region not found' });
    }
    const facilitiesInRegion = MOCK_FACILITIES.filter((f) => f.regionId === region.id);
    res.json({
      region,
      facilitiesCount: facilitiesInRegion.length,
      facilities: facilitiesInRegion,
    });
  });

  // Forecast endpoint
  app.get('/api/forecast/:facilityId', (req, res) => {
    const facility = MOCK_FACILITIES.find((f) => f.id === req.params.facilityId);
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    const trends = generateFacilityTrends(facility);
    res.json({
      facilityId: facility.id,
      facilityName: facility.name,
      historicalSpan: '2021 - 2026',
      forecastSpan: '2027 - 2030',
      trends,
    });
  });

  // What-if Scenario Simulation
  app.post('/api/scenario', (req, res) => {
    const {
      facilityId,
      renewableEnergyPct = 50,
      fossilFuelReductionPct = 20,
      productionLevelPct = 100,
      waterReductionPct = 25,
      emissionReductionPct = 30,
      wasteRecyclingPct = 80,
      energyEfficiencyPct = 15,
    } = req.body;

    const facility = MOCK_FACILITIES.find((f) => f.id === facilityId) || MOCK_FACILITIES[0];

    const result = calculateScenario(facility, {
      renewableEnergyPct: Number(renewableEnergyPct),
      fossilFuelReductionPct: Number(fossilFuelReductionPct),
      productionLevelPct: Number(productionLevelPct),
      waterReductionPct: Number(waterReductionPct),
      emissionReductionPct: Number(emissionReductionPct),
      wasteRecyclingPct: Number(wasteRecyclingPct),
      energyEfficiencyPct: Number(energyEfficiencyPct),
    });

    res.json({
      facilityId: facility.id,
      facilityName: facility.name,
      simulationResult: result,
      timestamp: new Date().toISOString(),
    });
  });

  // Alerts
  app.get('/api/alerts', (req, res) => {
    res.json({
      count: MOCK_ALERTS.length,
      alerts: MOCK_ALERTS,
    });
  });

  // Data Sources Registry
  app.get('/api/data-sources', (req, res) => {
    res.json({
      count: MOCK_DATA_SOURCES.length,
      sources: MOCK_DATA_SOURCES,
    });
  });

  // API Services catalogue
  app.get('/api/api-services', (req, res) => {
    res.json({
      count: MOCK_API_SERVICES.length,
      services: MOCK_API_SERVICES,
    });
  });

  // Supabase PostgreSQL Schema inspection
  app.get('/api/supabase/schema', (req, res) => {
    res.type('text/plain').send(SUPABASE_SQL_SCHEMA);
  });

  // Mount standard x402 Router (Endpoints: /api/x402/environmental-intelligence, /api/x402/facility-assessment/:facilityId, /api/x402/settle, /api/x402/status, /api/x402/requirements)
  app.use('/api/x402', x402Router);

  // x402 Protocol Sandbox Handshake & Invoice Generation
  app.post('/api/v1/x402/request', (req, res) => {
    const { endpoint, facilityId } = req.body;
    const service = MOCK_API_SERVICES.find((s) => s.endpoint === endpoint) || MOCK_API_SERVICES[0];

    // HTTP 402 Payment Required spec representation
    res.status(402).json({
      status: 402,
      error: 'Payment Required',
      protocol: 'x402',
      version: '2.0',
      invoice: {
        id: `inv-${Date.now().toString(36)}`,
        endpoint: service.endpoint,
        targetFacilityId: facilityId || 'FAC-101',
        amountMicroAlgo: service.costMicroAlgo,
        amountAlgo: service.costMicroAlgo / 1000000,
        amountInr: service.costInr,
        network: ALGORAND_TESTNET_CAIP2,
        networkName: 'Algorand Testnet',
        assetId: USDC_TESTNET_ASA_ID,
        assetName: 'USDC (Testnet)',
        recipientAddress: PARIDRISHYA_AVM_ADDRESS,
        facilitatorUrl: FACILITATOR_URL,
        note: 'PARIDRISHYA Intelligence Query Settlement',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      },
    });
  });

  // x402 Protocol Settlement Verification via GoPlausible Facilitator & Algorand Testnet
  app.post('/api/v1/x402/settle', async (req, res) => {
    const { invoiceId, endpoint, facilityId, txId, signedTx } = req.body;
    const facility = MOCK_FACILITIES.find((f) => f.id === facilityId) || MOCK_FACILITIES[0];

    let verification;
    if (txId) {
      verification = await X402FacilitatorService.verifyPayment({ txId });
    } else {
      verification = await X402FacilitatorService.settlePayment({
        signedTx,
        assetId: USDC_TESTNET_ASA_ID,
        amountAtomic: '5000',
      });
    }

    if (!verification.valid) {
      return res.status(402).json({
        status: 'REJECTED',
        error: 'Settlement Failed',
        message: verification.error || 'Transaction could not be verified on Algorand Testnet.',
      });
    }

    res.json({
      status: 'VERIFIED_SETTLED',
      protocol: 'x402',
      txId: verification.txId,
      network: 'Algorand Testnet',
      confirmedRound: verification.confirmedRound || 67236000,
      settledAt: verification.verifiedAt || new Date().toISOString(),
      facilitator: verification.facilitator,
      explorerUrl: `https://lora.algokit.io/testnet/transaction/${verification.txId}`,
      payload: {
        facilityId: facility.id,
        facilityName: facility.name,
        sector: facility.sector,
        impactScore: facility.impactScore,
        riskLevel: facility.riskLevel,
        components: {
          emissionScore: facility.emissionScore,
          pollutionScore: facility.pollutionScore,
          resourceScore: facility.resourceScore,
          energyScore: facility.energyScore,
          environmentalStressScore: facility.environmentalStressScore,
          climateRiskScore: facility.climateRiskScore,
        },
        contributingFactors: calculateContributingFactors(facility),
        recommendations: generateRecommendations(facility),
        verifiedLicense: `M2M-x402-ALG-${verification.txId?.slice(0, 8)}`,
      },
    });
  });

  // AI-Assisted Deep Environmental Analysis Summary
  app.post('/api/ai/summary', async (req, res) => {
    const { facilityId } = req.body;
    const facility = MOCK_FACILITIES.find((f) => f.id === facilityId) || MOCK_FACILITIES[0];
    const factors = calculateContributingFactors(facility);

    if (genAiClient && process.env.GEMINI_API_KEY) {
      try {
        const response = await genAiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an expert environmental engineer for PARIDRISHYA, a government-grade environmental intelligence platform.
Provide an objective, 2-3 sentence technical synthesis for the following facility:
Name: ${facility.name}
Sector: ${facility.sector}
Region: ${facility.regionName}, ${facility.state}
Impact Score: ${facility.impactScore}/100 (${facility.riskLevel})
Key components: Emission Score=${facility.emissionScore}, Energy Score=${facility.energyScore}, Resource Score=${facility.resourceScore}, Air Pollution Score=${facility.pollutionScore}.
Top contributing factors: ${factors.map((f) => `${f.name} (${f.percentage}%)`).join(', ')}.

Rules:
- Strictly objective, scientific, and actionable.
- Do NOT make definitive causal legal claims (use words like 'modelled indicator', 'associated factor', 'estimated pressure').
- Keep under 75 words.`,
        });

        const text = response.text || generateExplainabilitySummary(facility);
        return res.json({ summary: text, source: 'Gemini 2.5 Flash Server-Side Synthesis' });
      } catch (err) {
        console.warn('Gemini inference error, falling back to analytical rule engine:', err);
      }
    }

    // High quality deterministic fallback
    res.json({
      summary: generateExplainabilitySummary(facility),
      source: 'PARIDRISHYA Deterministic Analytical Rule Engine',
    });
  });

  // --------------------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // --------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PARIDRISHYA server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
