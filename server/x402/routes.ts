import { Router, Request, Response } from 'express';
import { requireX402Payment, X402AuthenticatedRequest } from './middleware';
import { X402FacilitatorService } from './facilitator';
import {
  buildPaymentRequirement,
  PARIDRISHYA_AVM_ADDRESS,
  ALGORAND_TESTNET_CAIP2,
  USDC_TESTNET_ASA_ID,
  FACILITATOR_URL,
} from './payment-config';
import { MOCK_FACILITIES, MOCK_REGIONS } from '../../src/data/mockData';
import { UnlockedEnvironmentalIntelligence } from './types';

export const x402Router = Router();

// Helper to generate unlocked environmental intelligence
function buildIntelligencePayload(facilityId?: string): UnlockedEnvironmentalIntelligence {
  const facility =
    MOCK_FACILITIES.find((f) => f.id === facilityId || f.code === facilityId) ||
    MOCK_FACILITIES[0];

  return {
    facilityId: facility.id,
    facilityName: facility.name,
    sector: facility.sector,
    regionName: facility.regionName,
    state: facility.state,
    coordinates: facility.coordinates,
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
    metrics: {
      emissionsCO2kTonnes: facility.emissionsCO2kTonnes,
      emissionsSO2Tonnes: facility.emissionsSO2Tonnes,
      emissionsNO2Tonnes: facility.emissionsNO2Tonnes,
      emissionsPM25Tonnes: facility.emissionsPM25Tonnes,
      emissionsPM10Tonnes: facility.emissionsPM10Tonnes,
      waterAnnualMillionLitres: facility.waterAnnualMillionLitres,
      waterRecycledPct: facility.waterRecycledPct,
      renewableSharePct: facility.renewableSharePct,
    },
    contributingFactors: [
      { name: 'Flue Stack Mass Emission (SO2/NO2)', percentage: 38, color: '#f43f5e' },
      { name: 'Fine Particulate Inversion (PM2.5/PM10)', percentage: 24, color: '#fb923c' },
      { name: 'Groundwater Stress / High Withdrawal', percentage: 21, color: '#38bdf8' },
      { name: 'Thermal Dissipation & Waste Intensity', percentage: 17, color: '#a855f7' },
    ],
    recommendations: [
      {
        priority: 'IMMEDIATE',
        title: 'Install Flue Gas Desulfurization (FGD) wet scrubbers',
        reductionPct: 18.5,
        capexEstimate: '₹42 Crore',
      },
      {
        priority: 'HIGH',
        title: 'Commission 35 MW captive solar/wind PPAs',
        reductionPct: 12.0,
        capexEstimate: '₹28 Crore',
      },
      {
        priority: 'MEDIUM',
        title: 'Implement closed-loop Zero Liquid Discharge (ZLD)',
        reductionPct: 8.5,
        capexEstimate: '₹14 Crore',
      },
    ],
    forecastSummary:
      'Trajectory indicates potential 14-point Environmental Impact Score reduction by Q3 2028 if proposed Phase-I scrubber intervention is enacted.',
    licenseToken: `M2M-x402-ALG-${Date.now().toString(36).toUpperCase()}`,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Public: Status of x402 gateway, Algorand Testnet connectivity, and GoPlausible facilitator
 */
x402Router.get('/status', async (req: Request, res: Response) => {
  const health = await X402FacilitatorService.checkHealth();
  res.json({
    protocol: 'x402',
    version: 2,
    network: ALGORAND_TESTNET_CAIP2,
    facilitatorUrl: FACILITATOR_URL,
    receivingAddress: PARIDRISHYA_AVM_ADDRESS,
    assetId: USDC_TESTNET_ASA_ID,
    health,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Public: Inspect requirements for any endpoint
 */
x402Router.get('/requirements', (req: Request, res: Response) => {
  const requirement = buildPaymentRequirement('ENVIRONMENTAL_INTELLIGENCE');
  res.json(requirement);
});

/**
 * Public settlement endpoint: Processes settlement on Algorand Testnet via GoPlausible
 */
x402Router.post('/settle', async (req: Request, res: Response) => {
  const { facilityId, signedTx, txId, payerAddress } = req.body;

  let verification;
  if (txId) {
    verification = await X402FacilitatorService.verifyPayment({ txId });
  } else {
    verification = await X402FacilitatorService.settlePayment({
      signedTx,
      payerAddress,
      assetId: USDC_TESTNET_ASA_ID,
      amountAtomic: '5000',
    });
  }

  if (!verification.valid) {
    return res.status(402).json({
      error: 'Settlement Failed',
      message: verification.error || 'Algorand Testnet settlement could not be confirmed.',
      verification,
    });
  }

  const payload = buildIntelligencePayload(facilityId);

  res.json({
    status: 'VERIFIED_SETTLED',
    protocol: 'x402',
    txId: verification.txId,
    network: verification.network,
    confirmedRound: verification.confirmedRound,
    facilitator: verification.facilitator,
    explorerUrl: `https://lora.algokit.io/testnet/transaction/${verification.txId}`,
    settledAt: verification.verifiedAt,
    data: payload,
  });
});

/**
 * Protected Endpoint 1: Environmental Intelligence Assessment
 * Automatically returns HTTP 402 if unpaid; returns full intelligence if paid.
 */
x402Router.get(
  '/environmental-intelligence',
  requireX402Payment('ENVIRONMENTAL_INTELLIGENCE'),
  (req: X402AuthenticatedRequest, res: Response) => {
    const facilityId = (req.query.facilityId as string) || MOCK_FACILITIES[0].id;
    const payload = buildIntelligencePayload(facilityId);

    res.json({
      status: 'OK',
      protocol: 'x402',
      payment: req.x402Payment,
      explorerUrl: `https://lora.algokit.io/testnet/transaction/${req.x402Payment?.txId}`,
      data: payload,
    });
  }
);

/**
 * Protected Endpoint 2: Facility Assessment Dossier
 */
x402Router.get(
  '/facility-assessment/:facilityId',
  requireX402Payment('FACILITY_ASSESSMENT'),
  (req: X402AuthenticatedRequest, res: Response) => {
    const facility = MOCK_FACILITIES.find(
      (f) => f.id === req.params.facilityId || f.code === req.params.facilityId
    );

    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }

    const payload = buildIntelligencePayload(facility.id);

    res.json({
      status: 'OK',
      protocol: 'x402',
      payment: req.x402Payment,
      explorerUrl: `https://lora.algokit.io/testnet/transaction/${req.x402Payment?.txId}`,
      data: payload,
    });
  }
);
