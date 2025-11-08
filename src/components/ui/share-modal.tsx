import { useEffect, useRef } from "react";
import LinkIcon from "@/assets/ic_link.svg?react";
import XIcon from "@/assets/ic_x.svg?react";

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
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
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
          <button
            type="button"
            onClick={onKakaoShare}
            className="flex flex-1 flex-col items-center gap-3 rounded-xl bg-[#F5F5F5] p-4 transition-all hover:bg-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <div className="flex h-12 w-12 items-center justify-center">
              <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
                alt="카카오톡"
                className="h-12 w-12"
              />
            </div>
            <span className="font-medium text-[#3C1E1E] text-[14px]">
              카카오톡
            </span>
          </button>

          {/* Link Copy Button */}
          <button
            type="button"
            onClick={onLinkCopy}
            className="flex flex-1 flex-col items-center gap-3 rounded-xl bg-[#F5F5F5] p-4 transition-all hover:bg-[#E8E8E8] focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8E2D2D]">
              <LinkIcon className="h-6 w-6" />
            </div>
            <span className="text-[14px] font-medium text-[#3C1E1E]">
              {showCopyFeedback ? "복사완료!" : "링크 복사"}
            </span>
          </button>
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
