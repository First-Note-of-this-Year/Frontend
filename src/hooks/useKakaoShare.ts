import { useCallback } from "react";

interface KakaoShareOptions {
  shareUri?: string;
  ownerNickname?: string;
}

export const useKakaoShare = () => {
  const shareToKakao = useCallback(
    ({ shareUri, ownerNickname }: KakaoShareOptions) => {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        console.error("Kakao SDK is not initialized");
        alert("카카오톡 공유 기능을 사용할 수 없습니다.");
        return;
      }

      const templateId = Number(import.meta.env.VITE_KAKAO_TEMPLATE_ID);
      if (!templateId) {
        console.error("Kakao template ID is not defined");
        alert("카카오톡 템플릿 설정이 올바르지 않습니다.");
        return;
      }

      if (!shareUri) {
        console.error("shareUri is required for Kakao share");
        alert("공유 링크를 생성할 수 없습니다.");
        return;
      }

      const encodedShareUri = encodeURIComponent(shareUri);

      try {
        window.Kakao.Share.sendCustom({
          templateId,
          templateArgs: {
            shareUri: encodedShareUri,
          },
        });
      } catch (error) {
        console.error("Kakao share failed:", error);
        alert("카카오톡 공유에 실패했습니다.");
      }
    },
    []
  );

  return { shareToKakao };
};
