import { useEffect, useRef, useState } from "react";
import { useTimeStore } from "@/stores/useTimeStore";

export function NewYearCountdown() {
  const { serverTime } = useTimeStore();
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const startTimeRef = useRef<number>(0);
  const serverTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!serverTime) return;

    // 서버 시간과 클라이언트 시작 시간을 저장
    serverTimeRef.current = new Date(serverTime);
    startTimeRef.current = Date.now();

    const calculateTimeLeft = () => {
      if (!serverTimeRef.current) return "00:00:00";

      // 경과 시간을 계산하여 서버 시간에 더함
      const elapsed = Date.now() - startTimeRef.current;
      const currentTime = new Date(serverTimeRef.current.getTime() + elapsed);

      const currentYear = currentTime.getFullYear();

      // 현재가 12월이면 다음해 1월 1일, 1월이면 올해 1월 1일 (이미 지났으므로 00:00:00)
      const targetYear =
        currentTime.getMonth() === 11 ? currentYear + 1 : currentYear;
      const newYear = new Date(targetYear, 0, 1, 0, 0, 0, 0);

      const diff = newYear.getTime() - currentTime.getTime();

      if (diff <= 0) {
        return "00:00:00";
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    // 초기 계산
    setTimeLeft(calculateTimeLeft());

    // 100ms마다 업데이트하여 부드럽게 표시
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 100);

    return () => clearInterval(interval);
  }, [serverTime]);

  return (
    <span className="font-counter font-extrabold text-[74px] text-gray-100">
      {timeLeft}
    </span>
  );
}
