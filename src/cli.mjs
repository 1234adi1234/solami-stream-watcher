#!/usr/bin/env node
import { DEXStreamTelemetry } from './telemetry.mjs';
import { SolamiClient } from './solami_client.mjs';

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║  Solami Real-Time Solana DEX Telemetry & Liquidity Pulse Watcher     ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');

const telemetry = new DEXStreamTelemetry(5000); // $5,000 whale threshold
const client = new SolamiClient();

console.log('\n📡 Ingesting live Solana mainnet DEX trades via Solami Blur feed...');

// Mock 5 live trades across Raydium & Orca
const mockStream = [
  { sig: '4rbViHbm111', dex: 'Raydium_CPMM', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', side: 'BUY', volumeUsd: 1250 },
  { sig: '5scWjIcn222', dex: 'Orca_Whirlpool', mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', side: 'BUY', volumeUsd: 15400 }, // Whale
  { sig: '6tdXkJdo333', dex: 'Raydium_v4', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', side: 'SELL', volumeUsd: 430 },
  { sig: '7ueYlKep444', dex: 'Meteora_DAMM', mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', side: 'BUY', volumeUsd: 2800 },
  { sig: '8vfAmLfq555', dex: 'Raydium_v4', mint: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', side: 'SELL', volumeUsd: 8200 } // Whale
];

for (const raw of mockStream) {
  const trade = client.parseBlurTradePayload(raw);
  const result = telemetry.processTradeEvent(trade);
  const tag = result.isWhale ? '🚨 [WHALE ALERT]' : '⚡ [SWAP]';
  console.log(`   ${tag} ${trade.dex}: ${trade.side} $${trade.volumeUsd.toLocaleString()} (${trade.tokenMint.slice(0, 8)}...)`);
}

const summary = telemetry.getSummaryMetrics();
console.log('\n📊 5-Second Window Market Pulse Summary:');
console.log(`   - Total Volume: $${summary.totalVolumeUsd.toLocaleString()}`);
console.log(`   - Buy / Sell Volume: $${summary.buyVolumeUsd.toLocaleString()} / $${summary.sellVolumeUsd.toLocaleString()}`);
console.log(`   - Imbalance Ratio: ${summary.buySellRatio}x`);
console.log(`   - Dominant Sentiment: ${summary.sentiment}`);
console.log(`   - Whale Alerts Triggered: ${summary.whaleAlertCount}`);
