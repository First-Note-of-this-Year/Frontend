import { useEffect, useRef, useState } from "react";
import { useTimeStore } from "@/stores/useTimeStore";

export function NewYearCountdown() {
  const { serverTime } = useTimeStore();
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const startTimeRef = useRef<number>(0);
  const serverTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (!serverTime) return;

    // 서버 시간(UTC)을 파싱하고 9시간 더해서 한국 시간으로 변환
    const utcDate = new Date(serverTime);
    const kstDate = new Date(utcDate.getTime());
    //기존 const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    serverTimeRef.current = kstDate;
    startTimeRef.current = Date.now();

    const calculateTimeLeft = () => {
      if (!serverTimeRef.current) return "00:00:00";

      // 경과 시간을 계산하여 서버 시간에 더함
      const elapsed = Date.now() - startTimeRef.current;
      const currentTime = new Date(serverTimeRef.current.getTime() + elapsed);

      // 로컬 타임존 기준으로 년/월/일 확인
      const currentYear = currentTime.getFullYear();
      const month = currentTime.getMonth();
      const day = currentTime.getDate();

      // 1월 1일 ~ 1월 14일이면 무조건 카운트업 모드
      if (month === 0 && day >= 1 && day <= 14) {
        const newYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
        const diff = currentTime.getTime() - newYear.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
      }

      // 12월이면 다음해 1월 1일까지 카운트다운 (1초 느리게)
      const nextYear = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);
      const diff = nextYear.getTime() - currentTime.getTime() + 1000; // 1초 빼기

      if (diff <= 0) {
        // 새해가 지났지만 아직 1월이 아님 (타임존 차이)
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