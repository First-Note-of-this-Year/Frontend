import { create } from "zustand";
import { getBoardShareForAuth } from "@/apis/board";
import type { GetBoardShareResponse } from "@/types/board";

interface AuthState {
  isLoggedIn: boolean;
  isCheckingAuth: boolean;
  hasFetchedAuth: boolean;
  boardShare: GetBoardShareResponse["data"] | null;
  checkAuth: (options?: {
    force?: boolean;
  }) => Promise<GetBoardShareResponse["data"] | null>;
  setLoggedIn: (
    value: boolean,
    options?: { boardShare?: GetBoardShareResponse["data"] | null }
  ) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isCheckingAuth: false,
  hasFetchedAuth: false,
  boardShare: null,

  checkAuth: async ({ force = false } = {}) => {
    const { hasFetchedAuth, boardShare } = get();

    if (hasFetchedAuth && !force) {
      return boardShare;
    }

    set({ isCheckingAuth: true });

    try {
      const response = await getBoardShareForAuth();

      set({
        isLoggedIn: true,
        isCheckingAuth: false,
        hasFetchedAuth: true,
        boardShare: response.data,
      });

      return response.data;
    } catch {
      set({
        isLoggedIn: false,
        isCheckingAuth: false,
        hasFetchedAuth: true,
        boardShare: null,
      });

      return null;
    }
  },

  setLoggedIn: (value: boolean, options) => {
    set({
      isLoggedIn: value,
      isCheckingAuth: false,
      hasFetchedAuth: true,
      boardShare: options?.boardShare ?? null,
    });
  },

  reset: () => {
    set({
      isLoggedIn: false,
      isCheckingAuth: false,
      hasFetchedAuth: true,
      boardShare: null,
    });
  },
}));
