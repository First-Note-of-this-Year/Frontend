export const API_ENDPOINTS = {
  // 음악 관련
  MUSIC: {
    SEARCH: "/music/search",
    POPULAR_CHART: "/music/popular-chart",
  },

  // 인증 관련
  AUTH: {
    REISSUE: "/auth/reissue",
    LOGOUT: "/auth/logout",
    CHECK_LOGIN: "/auth/check-login",
  },

  // 시간 관련
  TIME: "/time",

  // 보드 관련
  BOARD: {
    LIST: "/board",
    DETAIL: (messageId: number | string) => `/board/${messageId}`,
    SHARE: "/board/share",
    SHARED_BOARD: (shareUri: string) => `/board/share/${shareUri}`,
    INFO: "/board/info",
    INFO_BY_SHARE_URI: (shareUri: string) => `/board/info/${shareUri}`,
    CREATE: "/board/create",
    UPDATE: "/board/update",
  },

  // 메시지 관련
  MESSAGE: {
    CREATE: "/message",
  },
} as const;
