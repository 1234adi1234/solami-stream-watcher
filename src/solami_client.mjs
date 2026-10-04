/**
 * Solami Blur API & Yellowstone gRPC Ingestion Client
 */

export class SolamiClient {
  constructor(apiKey = 'demo-key', baseUrl = 'https://api.solami.dev') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  parseBlurTradePayload(payload) {
    // Standardizes raw DEX trade event from Solami Blur WebSocket
    return {
      signature: payload.sig || payload.signature || 'mock_sig',
      dex: payload.dex || 'Raydium_v4',
      tokenMint: payload.mint || payload.tokenMint,
      side: payload.side || 'BUY',
      volumeUsd: Number(payload.volumeUsd || payload.usdAmount || 0),
      slot: Number(payload.slot || 0)
    };
  }
}
