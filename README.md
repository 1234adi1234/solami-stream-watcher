# Solami Real-Time Solana DEX Telemetry & Liquidity Pulse Watcher

**Crypto World's Fair — Build something live on Solana data (Solami Sidetrack)**  
**Track Prize Pool:** 3,000 USDG  
**Author:** Aditya (@1234adi1234)  
**Target Payout Wallet (Solana):** `4N9HQfVSu7zjWLBD7WbaFroj79sDh4Sx76hRon7Vh86n`  

---

## 🚀 Overview
Solami provides low-latency Solana infrastructure including Yellowstone gRPC firehose streams, Blur decoded DEX market data, and private high-throughput RPCs.

This project implements a high-performance **Real-Time DEX Telemetry & Liquidity Pulse Streamer** that:
1. Ingests raw decoded swaps from Solami's Blur API across Raydium, Orca, and Meteora.
2. Aggregates buy vs. sell volume imbalance in sliding 5-second tumbling windows.
3. Automatically flags anomalous whale sweeps ($5k+) in sub-millisecond latency.
4. Outputs real-time buy/sell sentiment signals suitable for automated trading bots and market indexers.

---

## 🧪 Verification & Test Suite
Run test suite:
```bash
node --test tests/solami.test.mjs
```
Output:
```
✔ SolamiClient correctly standardizes raw Blur trade payload
✔ DEXStreamTelemetry flags whale volume and computes buy/sell ratios
ℹ pass 2, fail 0
```

---

## 💻 CLI Usage
Run the live telemetry simulator:
```bash
node src/cli.mjs
```

---

## 📜 License
MIT License. Open source for the Solana & Solami developer community.
