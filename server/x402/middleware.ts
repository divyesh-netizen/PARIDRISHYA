import { Request, Response, NextFunction } from 'express';
import { buildPaymentRequirement, X402_SERVICES } from './payment-config';
import { X402FacilitatorService } from './facilitator';

export interface X402AuthenticatedRequest extends Request {
  x402Payment?: {
    txId?: string;
    verified: boolean;
    network: string;
    facilitator: string;
  };
}

/**
 * Middleware protecting endpoints with x402 payment requirement
 */
export function requireX402Payment(serviceKey: keyof typeof X402_SERVICES) {
  return async (req: X402AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Check payment headers
    const paymentProofHeader =
      req.headers['payment-signature'] ||
      req.headers['x-payment-proof'] ||
      req.headers['x-payment-txid'] ||
      (req.headers.authorization && req.headers.authorization.startsWith('x402 ')
        ? req.headers.authorization.replace('x402 ', '')
        : null);

    // If no payment proof is provided, immediately return genuine HTTP 402
    if (!paymentProofHeader) {
      const requirement = buildPaymentRequirement(serviceKey, req.originalUrl || req.path);
      return res.status(402).json(requirement);
    }

    // If payment proof is provided, verify via Facilitator and Algorand Testnet
    try {
      const verification = await X402FacilitatorService.verifyPayment({
        txId: typeof paymentProofHeader === 'string' ? paymentProofHeader : undefined,
      });

      if (!verification.valid) {
        return res.status(402).json({
          error: 'Payment Verification Failed',
          message: verification.error || 'Payment proof is invalid or unconfirmed on Algorand Testnet.',
          requirement: buildPaymentRequirement(serviceKey, req.originalUrl || req.path),
        });
      }

      // Valid payment! Attach payment context and proceed
      req.x402Payment = {
        txId: verification.txId,
        verified: true,
        network: verification.network,
        facilitator: verification.facilitator,
      };

      return next();
    } catch (err: any) {
      return res.status(500).json({
        error: 'Payment Gateway Error',
        message: err.message || 'Internal verification error with x402 gateway.',
      });
    }
  };
}
