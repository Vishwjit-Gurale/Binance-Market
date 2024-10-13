// CryptoToggle.js
import React, { useState, useEffect } from "react";
import CandlestickChart from "./CandlestickChart";
import BinanceWebSocket from "./BinanceWebSocket";
import ErrorBoundary from "./ErrorBoundary";
const CryptoToggle = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("ethusdt");
  const [interval, setInterval] = useState("1m");
  const [candlestickData, setCandlestickData] = useState([]);

  const handleSymbolChange = (e) => {
    const symbol = e.target.value;
    setSelectedSymbol(symbol);
    localStorage.setItem("selectedSymbol", symbol);
  };

  const handleIntervalChange = (e) => {
    const newInterval = e.target.value;
    setInterval(newInterval);
    localStorage.setItem("interval", newInterval);
  };

  useEffect(() => {
    const storedSymbol = localStorage.getItem("selectedSymbol");
    const storedInterval = localStorage.getItem("interval");

    if (storedSymbol) setSelectedSymbol(storedSymbol);
    if (storedInterval) setInterval(storedInterval);
  }, []);

  return (
    <div>
      <h1>Live Cryptocurrency Data</h1>

      <select onChange={handleSymbolChange} value={selectedSymbol}>
        <option value="ethusdt">ETH/USDT</option>
        <option value="bnbusdt">BNB/USDT</option>
        <option value="dotusdt">DOT/USDT</option>
      </select>

      <select onChange={handleIntervalChange} value={interval}>
        <option value="1m">1 Minute</option>
        <option value="3m">3 Minutes</option>
        <option value="5m">5 Minutes</option>
      </select>

      {/* WebSocketModule to handle data fetching */}
      <BinanceWebSocket
        symbol={selectedSymbol}
        interval={interval}
        onDataUpdate={setCandlestickData}
      />

      {/* Chart to display candlestick data */}
      <ErrorBoundary>
        <CandlestickChart data={candlestickData} />
      </ErrorBoundary>
    </div>
  );
};

export default CryptoToggle;
