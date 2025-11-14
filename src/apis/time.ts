// import type { ServerTimeResponse } from "@/apis/types/time";
// import { API_ENDPOINTS } from "./config/endpoints";
// import { apiGetPublic } from "@/lib/api";

//서버 시간 정보 조회
export const getServerTime = async (): Promise<string> => {
  // 데모데이 임시 수정: 로컬 시간 사용
  return new Date().toISOString();

  /* 기존
  const response = await apiGetPublic<{ data: ServerTimeResponse }>(
    API_ENDPOINTS.TIME
  );
  return response.data.serverTime;
  */
};
