import { useState, useCallback } from "react";
import { useShare } from "./useShare";
import { useKakaoShare } from "./useKakaoShare";

interface UseShareModalOptions {
  shareUri?: string;
  ownerNickname?: string;
}

export const useShareModal = ({
  shareUri,
  ownerNickname,
}: UseShareModalOptions = {}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const { shareBoard, isSharing } = useShare();
  const { shareToKakao } = useKakaoShare();

  const openShareModal = useCallback(() => {
    setIsShareModalOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setShowCopyFeedback(false);
  }, []);

  const handleKakaoShare = useCallback(() => {
    shareToKakao({ shareUri, ownerNickname });
    closeShareModal();
  }, [shareToKakao, shareUri, ownerNickname, closeShareModal]);

  const handleLinkCopy = useCallback(async () => {
    try {
      const result = await shareBoard();

      if (result.success && result.method === "clipboard") {
        setShowCopyFeedback(true);
        setTimeout(() => {
          setShowCopyFeedback(false);
          closeShareModal();
        }, 2000);
      } else if (result.success && result.method === "native") {
        closeShareModal();
      } else {
        console.error("Share failed:", result.error);
        alert("링크 복사에 실패했습니다.");
      }
    } catch (error) {
      console.error("Link copy error:", error);
      alert("링크 복사에 실패했습니다.");
    }
  }, [shareBoard, closeShareModal]);

  return {
    isShareModalOpen,
    showCopyFeedback,
    isSharing,
    openShareModal,
    closeShareModal,
    handleKakaoShare,
    handleLinkCopy,
  };
};
