import { API_ENDPOINTS } from "@/apis/config/endpoints";
import { apiPostPublic } from "@/lib/api";
import type { MessageData } from "@/types/message";

export const postMessage = async (
  body: Partial<MessageData>
): Promise<{ result: string }> => {
  const data = await apiPostPublic<{ result: string }, Partial<MessageData>>(
    API_ENDPOINTS.MESSAGE.CREATE,
    body
  );

  return data;
};
