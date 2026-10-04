/**
 * Real-time DEX Stream Telemetry Processor
 * Computes buy/sell volume imbalances and detects whale sweeps
 */

export class DEXStreamTelemetry {
  constructor(whaleThresholdUsd = 5000) {
    this.whaleThresholdUsd = whaleThresholdUsd;
    this.resetWindow();
  }

  resetWindow() {
    this.windowStart = Date.now();
    this.totalBuyUsd = 0;
    this.totalSellUsd = 0;
    this.tradeCount = 0;
    this.uniqueMints = new Set();
    this.whaleTrades = [];
  }

  processTradeEvent(trade) {
    const { tokenMint, side, volumeUsd, signature, dex } = trade;
    this.tradeCount++;
    this.uniqueMints.add(tokenMint);

    if (side.toUpperCase() === 'BUY') {
      this.totalBuyUsd += volumeUsd;
    } else {
      this.totalSellUsd += volumeUsd;
    }

    const isWhale = volumeUsd >= this.whaleThresholdUsd;
    if (isWhale) {
      this.whaleTrades.push({
        signature,
        tokenMint,
        side,
        volumeUsd,
        dex,
        timestamp: Date.now()
      });
    }

    return {
      isWhale,
      currentRatio: this.getBuySellRatio(),
      netVolumeUsd: this.totalBuyUsd - this.totalSellUsd
    };
  }

  getBuySellRatio() {
    if (this.totalSellUsd === 0) return this.totalBuyUsd > 0 ? 10.0 : 1.0;
    return parseFloat((this.totalBuyUsd / this.totalSellUsd).toFixed(2));
  }

  getSummaryMetrics() {
    const totalVolume = this.totalBuyUsd + this.totalSellUsd;
    return {
      windowDurationMs: Date.now() - this.windowStart,
      tradeCount: this.tradeCount,
      uniqueTokensTracked: this.uniqueMints.size,
      totalVolumeUsd: parseFloat(totalVolume.toFixed(2)),
      buyVolumeUsd: parseFloat(this.totalBuyUsd.toFixed(2)),
      sellVolumeUsd: parseFloat(this.totalSellUsd.toFixed(2)),
      buySellRatio: this.getBuySellRatio(),
      sentiment: this.totalBuyUsd > this.totalSellUsd ? 'BULLISH' : 'BEARISH',
      whaleAlertCount: this.whaleTrades.length
    };
  }
}
