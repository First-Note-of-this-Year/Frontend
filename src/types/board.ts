export interface CreateBoardRequest {
  nickname: string;
}

export interface CreateBoardResponse {
  boardId: string;
  userId: string;
  nickname: string;
  shareUri: string;
}

export interface GetBoardShareResponse {
  data: {
    boardId: string | null;
    shareUri: string;
  };
}

export interface SharedBoardMessage {
  messageId: string;
  musicId: string;
  coverImage: string;
}

export interface SharedBoardData {
  content: SharedBoardMessage[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface SharedBoardResponse {
  success: boolean;
  code: number;
  message: string;
  data: SharedBoardData;
}

export interface SharedBoardInfo {
  nickname: string;
}

export interface BoardListItem {
  messageId: string;
  sender: string;
  content: string;
  musicId: string;
  songTitle: string;
  artist: string;
  coverImage: string;
  songUrl: string;
  read: boolean;
}

export interface BoardListData {
  content: BoardListItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface BoardListResponse {
  success: boolean;
  code: number;
  message: string;
  data: BoardListData;
}

export interface BoardInfoData {
  nickname: string;
  profileImage: string;
  messageCount: number;
  serverTime: string;
}

export interface BoardInfoResponse {
  success: boolean;
  code: number;
  message: string;
  data: BoardInfoData;
}

export interface BoardMessageData {
  messageId: string;
  sender: string;
  content: string;
  musicId?: string | null;
  songTitle?: string | null;
  artist?: string | null;
  coverImage?: string | null;
  songUrl?: string | null;
  itunesUrl?: string | null;
  youtubeUrl?: string | null;
  mine?: boolean;
}

export interface BoardMessageResponse {
  success: boolean;
  code: number;
  message: string;
  data: BoardMessageData;
}
