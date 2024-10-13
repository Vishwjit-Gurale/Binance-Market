import { useEffect, useRef, useState } from "react";

const BinanceWebSocket = ({ symbol, interval, onDataUpdate }) => {
  const ws = useRef(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem(symbol);
    if (storedData) {
      onDataUpdate(JSON.parse(storedData)); // Load saved data from localStorage
    }

    const connectWebSocket = () => {
      ws.current = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection opened");
        setReconnectAttempts(0); // Reset reconnect attempts on successful connection
      };

      ws.current.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        const candlestick = parsedData.k;

        if (candlestick.x) {
          const newData = {
            time: candlestick.t,
            open: candlestick.o,
            high: candlestick.h,
            low: candlestick.l,
            close: candlestick.c,
          };
          onDataUpdate((prevData) => {
            const updatedData = [...prevData, newData];
            localStorage.setItem(symbol, JSON.stringify(updatedData)); // Save data
            return updatedData;
          });
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket closed");
        if (!isReconnecting) reconnectWebSocket(); // Reconnect when the connection closes
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.current.close(); // Close WebSocket on error to trigger reconnection
      };
    };

    const reconnectWebSocket = () => {
      if (reconnectAttempts < 5) {
        // Limit the number of reconnection attempts
        const timeout = Math.min(1000 * 2 ** reconnectAttempts, 30000); // Exponential backoff

        console.log(`Reconnecting in ${timeout / 1000} seconds...`);
        setIsReconnecting(true);
        setTimeout(() => {
          setReconnectAttempts((prev) => prev + 1);
          connectWebSocket();
          setIsReconnecting(false);
        }, timeout);
      } else {
        console.error("Max reconnection attempts reached. Giving up.");
      }
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close(); // Ensure WebSocket is closed when component unmounts
      }
    };
  }, [symbol, interval]);

  return <div>{isReconnecting && <p>Reconnecting...</p>}</div>;
};

export default BinanceWebSocket;
