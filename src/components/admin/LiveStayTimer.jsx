import React, { useState, useEffect } from 'react';

export const LiveStayTimer = ({ checkInTime }) => {
  const [elapsed, setElapsed] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!checkInTime) return;

    const updateTimer = () => {
      const start = new Date(checkInTime).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - start);

      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setElapsed({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [checkInTime]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-1.5 bg-[#544bec]/10 text-[#544bec] px-2.5 py-1 rounded-full text-xs font-semibold border border-[#544bec]/20">
      <span className="w-1.5 h-1.5 rounded-full bg-[#544bec]"></span>
      <span className="font-mono text-xs font-bold tracking-wider">
        {elapsed.hours}h {pad(elapsed.minutes)}m {pad(elapsed.seconds)}s
      </span>
    </div>
  );
};
