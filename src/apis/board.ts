import { API_ENDPOINTS } from "@/apis/config/endpoints";
import { apiGet, apiGetPublic, apiPatch, apiPost } from "@/lib/api";
import type {
  BoardInfoResponse,
  BoardListResponse,
  BoardMessageResponse,
  CreateBoardRequest,
  CreateBoardResponse,
  GetBoardShareResponse,
  SharedBoardResponse,
  UpdateBoardRequest,
  UpdateBoardResponse,
} from "@/types/board";

// 보드 생성
export const createBoard = async (
  request: CreateBoardRequest
): Promise<CreateBoardResponse> => {
  return apiPost<CreateBoardResponse, CreateBoardRequest>(
    API_ENDPOINTS.BOARD.CREATE,
    request
  );
};

// 보드 공유 링크 반환
export const getBoardShare = async (): Promise<GetBoardShareResponse> => {
  return apiGet<GetBoardShareResponse>(API_ENDPOINTS.BOARD.SHARE);
};

//공유 보드 메세지 반환
export const getSharedBoard = async (
  shareUri: string,
  page: number = 0
): Promise<SharedBoardResponse> => {
  const params = { pageNumber: page };

  return apiGetPublic<SharedBoardResponse, typeof params>(
    API_ENDPOINTS.BOARD.SHARED_BOARD(shareUri),
    params
  );
};

//보드 정보 반환
export const getBoardInfo = async (
  shareUri: string
): Promise<BoardInfoResponse> => {
  return apiGetPublic<BoardInfoResponse>(
    API_ENDPOINTS.BOARD.INFO_BY_SHARE_URI(shareUri)
  );
};

// shared 보드 정보 반환
export const getSharedBoardInfo = async (
  shareUri: string
): Promise<BoardInfoResponse> => {
  return apiGetPublic<BoardInfoResponse>(
    API_ENDPOINTS.BOARD.SHARED_BOARD(shareUri)
  );
};

//보드 상세 메세지 반환
export const getBoardDetail = async (
  messageId: string
): Promise<BoardMessageResponse> => {
  return apiGet<BoardMessageResponse>(API_ENDPOINTS.BOARD.DETAIL(messageId));
};

//보드 리스트 반환
export const getBoardList = async (page = 0): Promise<BoardListResponse> => {
  const params = { pageNumber: page };
  return apiGet<BoardListResponse, typeof params>(
    API_ENDPOINTS.BOARD.LIST,
    params
  );
};

//보드 프로필 수정
export const updateBoard = async (
  request: UpdateBoardRequest
): Promise<UpdateBoardResponse> => {
  return apiPatch<UpdateBoardResponse, UpdateBoardRequest>(
    API_ENDPOINTS.BOARD.UPDATE,
    request
  );
};
