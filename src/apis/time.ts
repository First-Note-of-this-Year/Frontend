import type { ServerTimeResponse } from "@/apis/types/time";
import { API_ENDPOINTS } from "./config/endpoints";
import { apiGetPublic } from "@/lib/api";

//서버 시간 정보 조회
export const getServerTime = async (): Promise<string> => {
  const response = await apiGetPublic<{ data: ServerTimeResponse }>(
    API_ENDPOINTS.TIME
  );
  return response.data.serverTime;
};
