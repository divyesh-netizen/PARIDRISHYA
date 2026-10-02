# PARIDRISHYA: x402 on Algorand Testnet Integration

## 1. Overview & Architecture

PARIDRISHYA implements the **x402 Payment Protocol** on **Algorand Testnet** using the **GoPlausible Payment Facilitator** to provide native, machine-to-machine (M2M) micropayment access to national environmental intelligence.

Instead of gated enterprise contracts, autonomous systems, ESG audit crawlers, and municipal monitoring pipelines can query high-resolution facility stress indices, stack telemetry, and polynomial mitigation forecasts programmatically by paying micro-USDC or micro-ALGO per request.

```
Client (M2M Agent / Browser / cURL)
        │
        ▼
   [GET /api/x402/environmental-intelligence]
        │
        ├─► (Unpaid) ──► HTTP 402 Payment Required
        │                - Network: algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=
        │                - Facilitator: https://facilitator.goplausible.xyz
        │                - PayTo: PARIDRISHYA AVM Address
        │                - Asset: 10458941 (USDC Testnet) / Amount: 5000 atomic units
        │
   [Client Settles via GoPlausible / Algorand Testnet]
        │
        ▼
   [POST /api/x402/settle or Header `x-payment-proof: <txId>`]
        │
        ├─► GoPlausible Facilitator & Algorand Testnet Verification
        │   - Checks confirmed round
        │   - Verifies receiver address & transaction validity
        │
        ▼
   HTTP 200 OK + Unlocked Environmental Intelligence JSON
   - Composite Impact Score & Component Breakdown
   - Stack Telemetry & Water Circularity Metrics
   - Mitigation Ranking & Forecast Trajectory
   - Verified LoRA Explorer Proof: https://lora.algokit.io/testnet/transaction/<txId>
```

---

## 2. Configuration & Network Parameters

| Parameter | Value |
|---|---|
| **Blockchain Network** | Algorand Testnet |
| **CAIP-2 Identifier** | `algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=` |
| **Testnet Genesis Hash** | `SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=` |
| **x402 Facilitator URL** | `https://facilitator.goplausible.xyz` |
| **Default Payment Asset** | USDC on Testnet (ASA ID `10458941`) or ALGO (Asset `0`) |
| **Protected Endpoints** | `GET /api/x402/environmental-intelligence`<br>`GET /api/x402/facility-assessment/:facilityId` |
| **Settlement Endpoint** | `POST /api/x402/settle` |
| **Gateway Health** | `GET /api/x402/status` |
| **Testnet Explorer** | `https://lora.algokit.io/testnet/transaction/{txId}` |

---

## 3. Environment Variables

Documented in `.env.example`:

```env
# Algorand & x402 AVM Gateway
AVM_ADDRESS=YVQAPHTUSQNILY5CWKXSI2WDPTHH2N4MK2FBHY3X4JJRAWXTC2XSBK7HHA
FACILITATOR_URL=https://facilitator.goplausible.xyz
ALGOD_SERVER=https://testnet-api.algonode.cloud
INDEXER_SERVER=https://testnet-idx.algonode.cloud
```

---

## 4. Testing the Flow

### Step 1: Unpaid Request (Receives HTTP 402)
```bash
curl -i http://localhost:3000/api/x402/environmental-intelligence
```
**Response:**
```json
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "x402Version": 2,
  "error": "Payment Required",
  "message": "Access to PARIDRISHYA Environmental Intelligence Assessment requires payment via x402 on Algorand Testnet.",
  "accepts": [
    {
      "scheme": "exact",
      "price": "$0.005",
      "network": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
      "payTo": "YVQAPHTUSQNILY5CWKXSI2WDPTHH2N4MK2FBHY3X4JJRAWXTC2XSBK7HHA",
      "extra": {
        "asset": "10458941",
        "assetName": "USDC (Testnet)",
        "decimals": 6,
        "amountAtomic": "5000",
        "facilitatorUrl": "https://facilitator.goplausible.xyz"
      }
    }
  ]
}
```

### Step 2: Settle on Algorand Testnet via GoPlausible Facilitator
```bash
curl -X POST http://localhost:3000/api/x402/settle \
  -H "Content-Type: application/json" \
  -d '{"facilityId": "FAC-101"}'
```
Returns a confirmed settlement with live Algorand Testnet transaction ID, round confirmation, and the unlocked environmental payload.

### Step 3: View on Algorand Testnet Explorer
Inspect the transaction at:
`https://lora.algokit.io/testnet/transaction/{txId}`
