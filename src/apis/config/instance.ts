import axios, { type AxiosError, type AxiosInstance } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { handleApiError } from "./error";

// 로딩 상태 관리
let loadingCount = 0;
let loadingCallback: ((isLoading: boolean) => void) | null = null;

// 토큰 재발급 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

export const setLoadingCallback = (callback: (isLoading: boolean) => void) => {
  loadingCallback = callback;
};

const updateLoadingState = () => {
  if (loadingCallback) {
    loadingCallback(loadingCount > 0);
  }
};

// 대기열 처리 함수
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Axios 인스턴스 생성
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}${import.meta.env.VITE_API_VERSION || ""}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    loadingCount++;
    updateLoadingState();

    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    loadingCount = Math.max(0, loadingCount - 1);
    updateLoadingState();
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    loadingCount = Math.max(0, loadingCount - 1);
    updateLoadingState();

    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }

    return response;
  },
  (error: AxiosError) => {
    loadingCount = Math.max(0, loadingCount - 1);
    updateLoadingState();

    // 에러 로깅
    if (import.meta.env.DEV) {
      console.error(
        `API Error: ${error.response?.status} ${error.config?.url}`,
        handleApiError(error)
      );
    }

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // skipAuthRedirect 플래그가 있으면 리다이렉트하지 않음
      const headers = originalRequest?.headers as Record<string, unknown> | undefined;
      const skipRedirect = headers?.skipAuthRedirect === 'true';
      if (skipRedirect) {
        return Promise.reject(error);
      }

      if (
        originalRequest &&
        !originalRequest.url?.includes(API_ENDPOINTS.AUTH.REISSUE)
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosInstance.request(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        return axiosInstance
          .post(API_ENDPOINTS.AUTH.REISSUE)
          .then(() => {
            processQueue(null);
            return axiosInstance.request(originalRequest);
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            if (window.location.pathname !== "/") {
              window.location.href = "/";
            }
            return Promise.reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
