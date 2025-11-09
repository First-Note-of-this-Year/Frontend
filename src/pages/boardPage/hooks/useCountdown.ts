import { useEffect, useState } from "react";

interface TimeRemaining {
  d: number;
  h: number;
  m: number;
  s: number;
}

export function useCountdown(serverTimeStr?: string) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  useEffect(() => {
    // use a fixed server time as requested
    const serverTime = serverTimeStr ?? new Date().toISOString();
    const serverNow = new Date(serverTime);
    const startClient = Date.now();

    function update() {
      const elapsed = Date.now() - startClient;
      const currentServer = new Date(serverNow.getTime() + elapsed);

      // 현재 서버 시간의 년도를 가져와서 다음 해 1월 1일 00:00:00 (로컬 시간) 계산
      const year = currentServer.getFullYear();
      const month = currentServer.getMonth();
      
      // 현재가 12월이면 다음해 1월 1일, 그 외에는 올해 1월 1일 (이미 지났으므로 0)
      const targetYear = month === 11 ? year + 1 : year + 1;
      const target = new Date(targetYear, 0, 1, 0, 0, 0, 0);
      
      let diffMs = target.getTime() - currentServer.getTime();
      if (diffMs < 0) diffMs = 0;

      const totalSec = Math.floor(diffMs / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeRemaining({ d, h, m, s });
    }

    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [serverTimeStr]);

  return timeRemaining;
}
