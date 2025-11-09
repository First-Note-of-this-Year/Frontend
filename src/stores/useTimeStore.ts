import { create } from "zustand";
import { getServerTime } from "@/apis/time";

/**
 * 서버 시간이 12월 31일 ~ 1월 14일 사이인지 확인
 */
const checkIsNewYearPeriod = (serverTime: string): boolean => {
  const date = new Date(serverTime);
  const month = date.getMonth();
  const day = date.getDate();

  return (month === 11 && day === 31) || (month === 0 && day <= 14);
};

/**
 * 서버 시간이 1월 1일 ~ 1월 14일 사이인지 확인
 */
const checkIsAfterNewYear = (serverTime: string): boolean => {
  const date = new Date(serverTime);
  const month = date.getMonth();
  const day = date.getDate();

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
