/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <explanation> */
import { useEffect, useRef } from "react";
import LinkIcon from "@/assets/ic_link.svg?react";
import XIcon from "@/assets/ic_x.svg?react";
import { ShareButton } from "./share-button";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKakaoShare: () => void;
  onLinkCopy: () => void;
  showCopyFeedback?: boolean;
}

export function ShareModal({
  isOpen,
  onClose,
  onKakaoShare,
  onLinkCopy,
  showCopyFeedback = false,
}: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative mx-4 w-full max-w-[360px] rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <XIcon className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="mb-6 text-center font-primary text-[20px] text-brown-200">
          공유하기
        </h2>

        {/* Share Options */}
        <div className="flex gap-4">
          {/* Kakao Share Button */}
          <ShareButton
            onClick={onKakaoShare}
            icon={
              <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                alt="카카오톡"
                className="h-12 w-12"
              />
            }
            label="카카오톡"
          />

          {/* Link Copy Button */}
          <ShareButton
            onClick={onLinkCopy}
            icon={<LinkIcon className="h-6 w-6" />}
            label={showCopyFeedback ? "복사완료!" : "링크 복사"}
            iconBgColor="#8E2D2D"
          />
        </div>

        {/* Feedback Message */}
        {showCopyFeedback && (
          <p className="mt-4 text-center text-[12px] text-gray-500">
            링크가 클립보드에 복사되었습니다
          </p>
        )}
      </div>
    </div>
  );
}
