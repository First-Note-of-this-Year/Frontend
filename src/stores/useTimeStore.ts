import { create } from "zustand";
import { getServerTime } from "@/apis/time";

/**
 * 서버 시간(UTC)을 한국 시간으로 변환
 */
const convertToKST = (serverTime: string): Date => {
  const utcDate = new Date(serverTime);
  return new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
};

/**
 * 서버 시간이 12월 31일 ~ 1월 14일 사이인지 확인 (한국 시간 기준)
 */
const checkIsNewYearPeriod = (serverTime: string): boolean => {
  const kstDate = convertToKST(serverTime);
  const month = kstDate.getMonth();
  const day = kstDate.getDate();

  return (month === 11 && day === 31) || (month === 0 && day <= 14);
};

/**
 * 서버 시간이 1월 1일 ~ 1월 14일 사이인지 확인 (한국 시간 기준)
 */
const checkIsAfterNewYear = (serverTime: string): boolean => {
  const kstDate = convertToKST(serverTime);
  const month = kstDate.getMonth();
  const day = kstDate.getDate();

  return month === 0 && day >= 1 && day <= 14;
};

interface TimeState {
  serverTime: string | null;
  isNewYear: boolean;
  isAfterNewYear: boolean;
  isLoading: boolean;
  error: string | null;
  fetchServerTime: () => Promise<void>;
}

let newYearTimeoutId: NodeJS.Timeout | null = null;

export const useTimeStore = create<TimeState>((set) => ({
  serverTime: null,
  isNewYear: false,
  isAfterNewYear: false,
  isLoading: false,
  error: null,

  fetchServerTime: async () => {
    set({ isLoading: true, error: null });
    try {
      const serverTime = await getServerTime();
      const isNewYear = checkIsNewYearPeriod(serverTime);
      const isAfterNewYear = checkIsAfterNewYear(serverTime);
      set({ serverTime, isNewYear, isAfterNewYear, isLoading: false });

      // 이전 타이머가 있으면 제거
      if (newYearTimeoutId) {
        clearTimeout(newYearTimeoutId);
        newYearTimeoutId = null;
      }

      // 12월이고 아직 새해가 아니라면, 1월 1일 00:00:00까지의 시간 계산
      if (!isAfterNewYear) {
        const kstDate = convertToKST(serverTime);
        const currentYear = kstDate.getFullYear();
        const month = kstDate.getMonth();

        // 12월인 경우에만 타이머 설정
        if (month === 11) {
          // 다음해 1월 1일 00:00:00 (한국 시간)
          const nextYearKST = new Date(currentYear + 1, 0, 1, 0, 0, 0, 0);

          // 새해까지 남은 시간 계산
          const serverNow = kstDate.getTime();
          const timeUntilNewYear = nextYearKST.getTime() - serverNow;

          if (timeUntilNewYear > 0) {
            newYearTimeoutId = setTimeout(() => {
              getServerTime().then((newServerTime) => {
                const actualIsAfterNewYear = checkIsAfterNewYear(newServerTime);
                set({
                  serverTime: newServerTime,
                  isAfterNewYear: actualIsAfterNewYear
                });
              }).catch((error) => {
                console.error("Failed to fetch server time on new year:", error);
                // 에러가 발생해도 클라이언트 시간 기준으로 isAfterNewYear를 true로 설정
                set({ isAfterNewYear: true });
              });
              newYearTimeoutId = null;
            }, timeUntilNewYear);
          }
        }
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "서버 시간을 가져오는데 실패했습니다",
        isLoading: false,
      });
    }
  },
}));
