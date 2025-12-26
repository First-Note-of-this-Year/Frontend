import axiosInstance from "@/apis/config/instance";
import { apiPost } from "@/lib/api";
import { API_ENDPOINTS } from "./config/endpoints";

interface LogoutResponse {
  success: boolean;
  code: number;
  message: string;
  data: string;
}

export interface CheckLoginResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    validUser: boolean;
    invalidToken: boolean;
    owner: boolean;
  };
}

export const logout = async (): Promise<LogoutResponse> => {
  return apiPost<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);
};

export const checkLogin = async (
  shareUri: string
): Promise<CheckLoginResponse> => {
  const response = await axiosInstance.post<CheckLoginResponse>(
    API_ENDPOINTS.AUTH.CHECK_LOGIN,
    null,
    {
      params: { shareUri },
      headers: { skipAuthRedirect: "true" },
    }
  );
  return response.data;
};
