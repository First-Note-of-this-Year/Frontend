import { useEffect, useRef } from "react";
import { useOverlayContext } from "../context/OverlayContext";
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
  const { registerLinkRef, requestHoleRects, showOverlay } = useOverlayContext();

  useEffect(() => {
    registerLinkRef(linkWrapperRef);
    // request rects so overlay has up-to-date positions
    requestHoleRects();
    const onResize = () => {
      if (showOverlay) requestHoleRects();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize);
    return () => {
      registerLinkRef(undefined);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
  }, [registerLinkRef, requestHoleRects, showOverlay]);
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
