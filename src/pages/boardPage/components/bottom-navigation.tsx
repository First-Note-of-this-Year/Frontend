import { useEffect, useRef } from "react";
import EnvelopIcon from "@/assets/ic_envelope.svg?react";
import LinkIcon from "@/assets/ic_link.svg?react";
import { LinkShareButton } from "@/components/ui/link-share-button";
import { Pagination } from "@/components/ui/pagination";

interface BottomNavigationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  ownerNickname: string;
  isSharedBoard: boolean;
  shareUri?: string;
  bottomGroupRef: React.RefObject<HTMLDivElement | null>;
  onShareClick?: () => void;
}

export function BottomNavigation({
  totalPages,
  currentPage,
  onPageChange,
  ownerNickname,
  isSharedBoard,
  shareUri,
  bottomGroupRef,
  onShareClick,
}: BottomNavigationProps) {
  const linkWrapperRef = useRef<HTMLDivElement | null>(null);

  // Respond to header requests for hole rects so the overlay can punch a hole
  // over the link-share button when needed.
  useEffect(() => {
    const sendLinkRect = () => {
      try {
        const el = linkWrapperRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        window.dispatchEvent(
          new CustomEvent("boardOverlayLinkRect", {
            detail: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height,
            },
          })
        );
      } catch {
        // ignore
      }
    };

    const handler = () => setTimeout(sendLinkRect, 0);
    window.addEventListener(
      "boardOverlayRequestHoleRect",
      handler as EventListener
    );

    // Also send rect if overlay is already active on mount
    if (
      typeof document !== "undefined" &&
      document.body.classList.contains("board-overlay-active")
    ) {
      setTimeout(sendLinkRect, 50);
    }

    // resend on resize/scroll while overlay active
    const onResize = () => {
      if (
        typeof document !== "undefined" &&
        document.body.classList.contains("board-overlay-active")
      )
        sendLinkRect();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);

    return () => {
      window.removeEventListener(
        "boardOverlayRequestHoleRect",
        handler as EventListener
      );
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, []);
  return (
    <div
      ref={bottomGroupRef}
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-40 flex justify-center"
    >
      <div className="pointer-events-auto flex w-full max-w-[450px] flex-col items-center gap-4 px-0">
        <div style={{ width: "100%" }}>
          <Pagination
            totalPages={totalPages}
            initialPage={currentPage + 1}
            onPageChange={(page) => onPageChange(page - 1)}
          />
        </div>
        <div style={{ width: "100%" }} ref={linkWrapperRef}>
          <LinkShareButton
            label={
              isSharedBoard
                ? `${ownerNickname}님에게 마음 전달하기`
                : "링크 공유"
            }
            Icon={isSharedBoard ? EnvelopIcon : LinkIcon}
            className="w-full"
            isSharedBoard={isSharedBoard}
            shareUri={shareUri}
            onShareClick={onShareClick}
          />
        </div>
      </div>
    </div>
  );
}
