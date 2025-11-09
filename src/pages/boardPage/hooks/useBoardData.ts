import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  getBoardInfo,
  getBoardList,
  getBoardShare,
  getSharedBoard,
} from "@/apis/board";
import type { BoardListItem, SharedBoardMessage } from "@/types/board";

export function useBoardData(shareUri?: string) {
  const isSharedBoard = Boolean(shareUri);
  const [currentPage, setCurrentPage] = useState(0);
  const [ownerNickname, setOwnerNickname] = useState<string>("닉네임");
  const [boardList, setBoardList] = useState<
    BoardListItem[] | SharedBoardMessage[]
  >([]);
  const [boardTotalElements, setBoardTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { data: sharedBoardData } = useQuery({
    queryKey: ["sharedBoard", shareUri, currentPage],
    queryFn: () => getSharedBoard(shareUri ?? "", currentPage),
    enabled: isSharedBoard && Boolean(shareUri),
  });

  const { data: currentUserBoard } = useQuery({
    queryKey: ["currentUserBoard"],
    queryFn: () => getBoardShare(),
    enabled: !isSharedBoard,
    retry: false,
  });

  // prefer route shareUri when present, otherwise use current user's shareUri
  const shareUriFromCurrentUser = useMemo(() => {
    // derive shareUri from possible shapes returned by getBoardShare()
    const maybe = currentUserBoard as unknown as
      | Record<string, unknown>
      | undefined;
    const maybeData = maybe?.data as Record<string, unknown> | undefined;

    return (
      // standard typed shape
      (currentUserBoard as unknown as { data?: { shareUri?: string } })?.data
        ?.shareUri ??
      // top-level or alternative keys
      (maybe && (maybe.shareUri as string | undefined)) ??
      (maybeData && (maybeData.share_uri as string | undefined)) ??
      (maybe && (maybe.share_url as string | undefined))
    );
  }, [currentUserBoard]);

  const computedShareUri = useMemo(() => {
    return shareUri ?? shareUriFromCurrentUser;
  }, [shareUri, shareUriFromCurrentUser]);

  // boardInfo query: fetch automatically when a shareUri (route or current user) exists
  const boardInfoQuery = useQuery({
    queryKey: ["boardInfo", computedShareUri],
    queryFn: ({ queryKey }) => {
      const uri = queryKey[1] as string;
      return getBoardInfo(uri);
    },
    enabled: Boolean(computedShareUri),
  });

  // fetch current user's board list (paginated) when not viewing a shared board
  const { data: currentUserBoardList } = useQuery({
    queryKey: ["currentUserBoardList", currentPage],
    queryFn: () => getBoardList(currentPage),
    enabled: !isSharedBoard,
  });

  useEffect(() => {
    // prefer boardInfo nickname when available (applies to shared and own board)
    const nicknameFromInfo = boardInfoQuery.data?.data?.nickname;
    if (nicknameFromInfo && nicknameFromInfo !== ownerNickname) {
      setOwnerNickname(nicknameFromInfo);
    }
  }, [boardInfoQuery.data?.data?.nickname, ownerNickname]);

  useEffect(() => {
    // handle shared board data
    if (isSharedBoard && sharedBoardData?.data) {
      let contentList = sharedBoardData.data.content ?? [];
      
      // 1페이지일 때 6번째 위치(인덱스 5)에 더미 아이템 삽입 (개발자 코멘트용)
      if (currentPage === 0) {
        const dummyItem: SharedBoardMessage = {
          messageId: "developer-comment-placeholder",
          musicId: "",
          coverImage: "",
        };
        
        // 메시지가 5개 미만이면 빈 공간을 채워서 6번째 위치에 하트가 오도록 함
        if (contentList.length < 5) {
          // 5개가 될 때까지 빈 아이템 추가
          const emptyItemsNeeded = 5 - contentList.length;
          const emptyItems: SharedBoardMessage[] = Array(emptyItemsNeeded).fill(null).map((_, i) => ({
            messageId: `empty-${i}`,
            musicId: "",
            coverImage: "",
          }));
          contentList = [...contentList, ...emptyItems];
        }
        
        // 6번째 위치(인덱스 5)에 하트 삽입
        contentList = [
          ...contentList.slice(0, 5),
          dummyItem,
          ...contentList.slice(5),
        ];
      }
      
      setBoardList(contentList);
      setTotalPages(sharedBoardData.data.totalPages ?? 1);
      setBoardTotalElements(sharedBoardData.data.totalElements ?? 0);
    }
  }, [isSharedBoard, sharedBoardData, currentPage]);

  useEffect(() => {
    // handle current user board data
    if (!isSharedBoard && currentUserBoardList) {
      const data = currentUserBoardList.data;
      let contentList = data.content ?? [];
      
      // 1페이지일 때 6번째 위치(인덱스 5)에 더미 아이템 삽입 (개발자 코멘트용)
      if (currentPage === 0) {
        const dummyItem: BoardListItem = {
          messageId: "developer-comment-placeholder",
          sender: "",
          content: "",
          musicId: "",
          songTitle: "",
          artist: "",
          coverImage: "",
          songUrl: "",
          read: true,
        };
        
        // 메시지가 5개 미만이면 빈 공간을 채워서 6번째 위치에 하트가 오도록 함
        if (contentList.length < 5) {
          // 5개가 될 때까지 빈 아이템 추가
          const emptyItemsNeeded = 5 - contentList.length;
          const emptyItems: BoardListItem[] = Array(emptyItemsNeeded).fill(null).map((_, i) => ({
            messageId: `empty-${i}`,
            sender: "",
            content: "",
            musicId: "",
            songTitle: "",
            artist: "",
            coverImage: "",
            songUrl: "",
            read: true,
          }));
          contentList = [...contentList, ...emptyItems];
        }
        
        // 6번째 위치(인덱스 5)에 하트 삽입
        contentList = [
          ...contentList.slice(0, 5),
          dummyItem,
          ...contentList.slice(5),
        ];
      }
      
      setBoardList(contentList);
      setBoardTotalElements(data.totalElements ?? data.content?.length ?? 0);
      setTotalPages(data.totalPages ?? 1);
    }
  }, [isSharedBoard, currentUserBoardList, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    ownerNickname,
    boardList,
    boardTotalElements,
    totalPages,
    sharedBoardData,
    currentUserBoard,
    boardInfoQuery,
    isSharedBoard,
  };
}
