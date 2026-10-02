import { X402PaymentAccept, X402PaymentRequirement } from './types';

// Algorand Testnet Constants
export const ALGORAND_TESTNET_CAIP2 = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
export const ALGORAND_TESTNET_GENESIS_HASH = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
export const USDC_TESTNET_ASA_ID = '10458941'; // Official USDC on Algorand Testnet

// Network nodes
export const ALGOD_TESTNET_SERVER = process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud';
export const INDEXER_TESTNET_SERVER = process.env.INDEXER_SERVER || 'https://testnet-idx.algonode.cloud';

// GoPlausible Facilitator
export const FACILITATOR_URL = process.env.FACILITATOR_URL || 'https://facilitator.goplausible.xyz';

// PARIDRISHYA Protocol Receiving Account on Algorand Testnet
export const PARIDRISHYA_AVM_ADDRESS =
  process.env.AVM_ADDRESS ||
  process.env.PARIDRISHYA_ALGO_ADDRESS ||
  'YVQAPHTUSQNILY5CWKXSI2WDPTHH2N4MK2FBHY3X4JJRAWXTC2XSBK7HHA';

// Facilitator Fee Payer (from GoPlausible supported specs)
export const GOPLAUSIBLE_FEE_PAYER = 'ZMFK2OI7ZBD2U27ISERZC4S6LKM6WMFJPZQ4MYNJDZ2VNBNMBA67RA22AA';

// Services and pricing
export const X402_SERVICES = {
  ENVIRONMENTAL_INTELLIGENCE: {
    id: 'SVC-ENV-INTEL-01',
    name: 'PARIDRISHYA Environmental Intelligence Assessment',
    description: 'High-resolution multi-vector facility impact score, component attribution, and statutory risk assessment',
    endpoint: '/api/x402/environmental-intelligence',
    priceUsdc: '$0.005',
    atomicUsdc: '5000', // 0.005 * 10^6
    microAlgo: 5000,
  },
  FACILITY_ASSESSMENT: {
    id: 'SVC-FAC-ASSESS-02',
    name: 'Facility Audit Dossier & Compliance Telemetry',
    description: 'Complete stack emissions, water circularity rate, and CapEx mitigation ranking',
    endpoint: '/api/x402/facility-assessment',
    priceUsdc: '$0.005',
    atomicUsdc: '5000',
    microAlgo: 5000,
  },
  REGIONAL_RISK: {
    id: 'SVC-REG-RISK-03',
    name: 'Basin Ecosystem Vulnerability & Receptors Analysis',
    description: 'Watershed stress, demographic exposure, and ambient airshed inversion sensitivity',
    endpoint: '/api/x402/regional-risk',
    priceUsdc: '$0.005',
    atomicUsdc: '5000',
    microAlgo: 5000,
  },
};

export function buildPaymentRequirement(serviceKey: keyof typeof X402_SERVICES, resourcePath?: string): X402PaymentRequirement {
  const service = X402_SERVICES[serviceKey];
  const endpoint = resourcePath || service.endpoint;

  const accepts: X402PaymentAccept[] = [
    {
      scheme: 'exact',
      price: service.priceUsdc,
      network: ALGORAND_TESTNET_CAIP2,
      payTo: PARIDRISHYA_AVM_ADDRESS,
      extra: {
        asset: USDC_TESTNET_ASA_ID,
        assetName: 'USDC (Testnet)',
        decimals: 6,
        amountAtomic: service.atomicUsdc,
        facilitatorUrl: FACILITATOR_URL,
        feePayer: GOPLAUSIBLE_FEE_PAYER,
      },
    },
    {
      scheme: 'exact',
      price: '0.005 ALGO',
      network: ALGORAND_TESTNET_CAIP2,
      payTo: PARIDRISHYA_AVM_ADDRESS,
      extra: {
        asset: '0',
        assetName: 'ALGO (MicroAlgos)',
        decimals: 6,
        amountAtomic: String(service.microAlgo),
        facilitatorUrl: FACILITATOR_URL,
        feePayer: GOPLAUSIBLE_FEE_PAYER,
      },
    },
  ];

  return {
    x402Version: 2,
    error: 'Payment Required',
    message: `Access to ${service.name} requires payment via x402 on Algorand Testnet.`,
    accepts,
    resource: {
      id: service.id,
      name: service.name,
      description: service.description,
      endpoint,
      pricing: {
        usdc: service.priceUsdc,
        microAlgo: service.microAlgo,
      },
    },
  };
}
