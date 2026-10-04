import test from 'node:test';
import assert from 'node:assert/strict';
import { DEXStreamTelemetry } from '../src/telemetry.mjs';
import { SolamiClient } from '../src/solami_client.mjs';

test('SolamiClient correctly standardizes raw Blur trade payload', () => {
  const client = new SolamiClient('test-key');
  const raw = {
    sig: 'sig_abc123',
    dex: 'Raydium_v4',
    mint: 'So11111111111111111111111111111111111111112',
    side: 'BUY',
    volumeUsd: '1500.50'
  };

  const trade = client.parseBlurTradePayload(raw);
  assert.equal(trade.signature, 'sig_abc123');
  assert.equal(trade.dex, 'Raydium_v4');
  assert.equal(trade.volumeUsd, 1500.50);
  assert.equal(trade.side, 'BUY');
});

test('DEXStreamTelemetry flags whale volume and computes buy/sell ratios', () => {
  const telemetry = new DEXStreamTelemetry(1000); // Whale threshold $1,000

  // Regular trade
  const r1 = telemetry.processTradeEvent({
    tokenMint: 'MintA',
    side: 'BUY',
    volumeUsd: 200,
    signature: 'sig1',
    dex: 'Orca'
  });
  assert.equal(r1.isWhale, false);

  // Whale trade
  const r2 = telemetry.processTradeEvent({
    tokenMint: 'MintB',
    side: 'SELL',
    volumeUsd: 2500,
    signature: 'sig2',
    dex: 'Meteora'
  });
  assert.equal(r2.isWhale, true);

  const summary = telemetry.getSummaryMetrics();
  assert.equal(summary.tradeCount, 2);
  assert.equal(summary.uniqueTokensTracked, 2);
  assert.equal(summary.totalVolumeUsd, 2700);
  assert.equal(summary.whaleAlertCount, 1);
  assert.equal(summary.sentiment, 'BEARISH');
});
