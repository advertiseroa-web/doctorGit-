import { useState, useEffect } from 'react';

export interface AdalatTelemetry {
  layer: string;
  status: 'passed' | 'failed' | 'pending';
  score: number;
}

/**
 * Monitors real-time pass/fail telemetry from per-layer judges.
 */
export function useAdalatStream() {
  const [telemetry, setTelemetry] = useState<AdalatTelemetry[]>([]);

  useEffect(() => {
    // Setup mock streams simulating Adalat runtime locally passing layer data
    const interval = setInterval(() => {
      setTelemetry((prev) => [
        ...prev, 
        { layer: 'UI Matrix', status: Math.random() > 0.1 ? 'passed' : 'failed', score: Math.round(90 + Math.random() * 10) }
      ].slice(-5));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return { telemetry };
}
