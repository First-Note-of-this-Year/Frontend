import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import type {
  BoardListItem,
  SharedBoardMessage,
  SharedBoardResponse,
} from "@/types/board";

export function useLetterModal(
  isSharedBoard: boolean,
  boardList: BoardListItem[] | SharedBoardMessage[],
  sharedBoardData?: SharedBoardResponse
) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [letterOpenId, setLetterOpenId] = useState<number | null>(null);
  const [messageDetail, setMessageDetail] = useState<
    import("@/types/board").BoardMessageData | null
  >(null);

  const { isPlaying, playAudio, stopAudio, toggleAudio } = useAudio();

  useEffect(() => {
    if (letterOpenId !== null) {
      // focus overlay so keyboard events (Escape) are captured
      overlayRef.current?.focus();
    }
  }, [letterOpenId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (letterOpenId === null) {
        setMessageDetail(null);
        stopAudio();
        return;
      }

      // determine messageId from current data (shared or boardList)
      const posIndex = letterOpenId - 1;
      const sharedContent = sharedBoardData?.data?.content ?? [];
      const possible = isSharedBoard
        ? sharedContent[posIndex]
        : boardList[posIndex];
      const messageId = possible?.messageId;
      if (!messageId) return;

      // 개발자 코멘트는 상세 정보를 불러오지 않음 (항상 6번째 위치, 인덱스 5)
      const isDeveloperComment = posIndex === 5;
      if (isDeveloperComment) {
        if (!mounted) return;
        setMessageDetail({
          messageId: "developer-comment",
          sender: "팀 오소리",
          content: "새해를 맞이해 가장 먼저 너에게 편지를 쓴다. 지난 한 해 동안 정말 수고 많았어. 계획했던 모든 것을 이루지는 못했더라도, 너는 매 순간 최선을 다하며 한 걸음씩 나아갔다는 것을 알아. 때론 넘어지고, 때론 좌절했을지라도 포기하지 않고 버텨줘서 정말 고마워. 그 모든 시간들이 너를 더 단단하게 만들었을 거야.버텨줘서 정말 고마워. 그 모든 시간들이 너를 더 단단하게 만들었을 새해 복 많이 받자!!",
          musicId: null,
          songTitle: null,
          artist: null,
          coverImage: null,
          songUrl: null,
          itunesUrl: null,
          youtubeUrl: null,
          mine: false,
        });
        return;
      }

      try {
        const res = await (await import("@/apis/board")).getBoardDetail(
          messageId
        );
        if (!mounted) return;
        setMessageDetail(res.data ?? null);

        // Start playing music if songUrl is available
        if (res.data?.songUrl) {
          playAudio(res.data.songUrl).catch((error) => {
            console.error("Failed to start audio playback:", error);
          });
        }
      } catch (err) {
        console.error("Failed to load message detail", err);
        setMessageDetail(null);
      }
    })();

    return () => {
      mounted = false;
      // Always stop audio when letter is closed
      stopAudio();
    };
  }, [
    letterOpenId,
    isSharedBoard,
    boardList,
    sharedBoardData,
    playAudio,
    stopAudio,
  ]);

  const closeModal = () => {
    setLetterOpenId(null);
    stopAudio();
  };

  return {
    overlayRef,
    letterOpenId,
    setLetterOpenId,
    messageDetail,
    isPlaying,
    toggleAudio,
    closeModal,
  };
}
