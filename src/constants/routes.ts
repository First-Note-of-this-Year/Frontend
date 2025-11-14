export const ROUTES = {
  HOME: "/",
  BOARD: "/board",
  SHARED_BOARD: "/board/:shareUri",
  JOIN: {
    NICKNAME: "/join/nickname",
    GUIDE: "/join/letter/guide",
    GUIDE_WITH_SHARE: "/join/letter/guide/:shareUri",
    SEARCH: "/join/letter/search",
    SEARCH_WITH_SHARE: "/join/letter/search/:shareUri",
    SELECT: "/join/letter/select",
    SELECT_WITH_SHARE: "/join/letter/select/:shareUri",
    WRITE: "/join/letter/write",
    WRITE_WITH_SHARE: "/join/letter/write/:shareUri",
    COMPLETE: "/join/complete",
    COMPLETE_WITH_SHARE: "/join/letter/complete/:shareUri",
  },
  LETTER: {
    GUIDE: "/letter/guide/:shareUri",
    SEARCH: "/letter/search/:shareUri",
    SELECT: "/letter/select/:shareUri",
    WRITE: "/letter/write/:shareUri",
    COMPLETE: "/letter/complete/:shareUri",
  },
  OAUTH: {
    CALLBACK: "/oauth/callback",
  },
  USER: {
    PROFILE: "/user/profile",
    INQUIRY: "/user/inquiry",
  },
  ERROR: "*",
} as const;
