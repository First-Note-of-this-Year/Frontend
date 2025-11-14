import { useState } from "react";
import { useParams } from "react-router-dom";
import bgbottom from "@/assets/bg_bottom.webp";
import GarlandIcon from "@/assets/bg_garland.svg?react";
import drawerIcon from "@/assets/ic_drawer.webp";
import bonsaiNormal from "@/assets/ic_bonsai_normal.webp";
import bonsaiNewYear from "@/assets/ic_bonsai_newyear.webp";
import HatIcon from "@/assets/ic_hat.svg?react";
import LpNormalIcon from "@/assets/ic_lp_normal.webp";
import LpPlayingIcon from "@/assets/ic_lp_playing.webp";
import windowNewYearIcon from "@/assets/ic_window_newyear.webp";
import windowIcon from "@/assets/ic_window_normal.webp";
import { ShareModal } from "@/components/ui/share-modal";
import { Sidebar } from "@/components/ui/sidebar";
import { Toast } from "@/components/ui/toast";
import { useShareModal } from "@/hooks/useShareModal";
import { useTimeStore } from "@/stores/useTimeStore";
import { AlbumGrid } from "./components/album-grid";
import { BoardHeader } from "./components/board-header";
import { BottomNavigation } from "./components/bottom-navigation";
import { LetterModal } from "./components/letter-modal";
import { useBoardData } from "./hooks/useBoardData";
import { useCountdown } from "./hooks/useCountdown";
import { useLayoutCalculation } from "./hooks/useLayoutCalculation";
import { useLetterModal } from "./hooks/useLetterModal";

function BoardPage() {
  const { shareUri } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLpPlaying, setIsLpPlaying] = useState(false);
  const { isNewYear } = useTimeStore();

  // 화면 높이 가져오기
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 850;
  const rawRatio = screenHeight / 850;
  const heightRatio = Math.max(0.3, Math.min(1, rawRatio * rawRatio));

  // Window 아이콘 top 값 (hamburger와 동일)
  const baseWindowTop = 49;
  const windowTop = baseWindowTop * heightRatio;

  // Custom hooks
  const {
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
  } = useBoardData(shareUri);

  const {
    shelfRef,
    shelfWrapperRef,
    bottomGroupRef,
    screenWidth,
    frameCenter,
    computeShift,
  } = useLayoutCalculation();

  const timeRemaining = useCountdown(boardInfoQuery?.data?.data?.serverTime);

  const {
    overlayRef,
    letterOpenId,
    handleAlbumClick,
    messageDetail,
    isPlaying,
    toggleAudio,
    closeModal,
    showToast,
    setShowToast,
    toastMessage,
  } = useLetterModal(isSharedBoard, boardList, sharedBoardData, currentPage);

  const {
    isShareModalOpen,
    showCopyFeedback,
    openShareModal,
    closeShareModal,
    handleKakaoShare,
    handleLinkCopy,
  } = useShareModal({
    shareUri: isSharedBoard ? shareUri : currentUserBoard?.data?.shareUri,
    ownerNickname,
  });

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{
        paddingTop: 140,
        paddingBottom: 0,
      }}
    >
      {/* Garland Icon - 200px clipped, centered at top (New Year only) */}
      {isNewYear && (
        <div
          className="pointer-events-none fixed z-20"
          style={{
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100vw",
            maxWidth: "450px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{ marginTop: -200, marginLeft: -100, width: "fit-content" }}
          >
            <GarlandIcon />
          </div>
        </div>
      )}

      {/* Window Icon - 79px clipped on right, positioned at top */}
      <div
        className="pointer-events-none fixed z-10"
        style={{
          top: windowTop,
          right: screenWidth >= 450 ? `calc(50% - 225px)` : 0,
          width: "fit-content",
          overflow: "hidden",
        }}
      >
        <div style={{ marginRight: -79 }}>
          <img
            src={isNewYear ? windowNewYearIcon : windowIcon}
            alt=""
            aria-hidden
            style={{ width: 266, height: "auto", display: "block" }}
          />
        </div>
      </div>

      <BoardHeader
        ownerNickname={ownerNickname}
        messagesCount={
          boardInfoQuery?.data?.data?.messageCount ??
          (isSharedBoard
            ? sharedBoardData?.data?.totalElements
            : boardTotalElements)
        }
        timeRemaining={timeRemaining}
        screenWidth={screenWidth}
        profileImage={boardInfoQuery?.data?.data?.profileImage}
        frameCenter={frameCenter}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div
        className="fixed z-20"
        style={{
          bottom: 65,
          left:
            screenWidth >= 450
              ? `calc(50% - 225px + 15px)`
              : screenWidth >= 390
                ? 15
                : Math.max(3, 15 - (390 - screenWidth) * 0.5),
        }}
      >
        <AlbumGrid
          boardList={boardList}
          isSharedBoard={isSharedBoard}
          shelfRef={shelfRef}
          shelfWrapperRef={shelfWrapperRef}
          onComputeShift={computeShift}
          onAlbumClick={handleAlbumClick}
          screenWidth={screenWidth}
          currentPage={currentPage}
        />

        <LetterModal
          isOpen={letterOpenId !== null}
          letterOpenId={letterOpenId}
          messageDetail={messageDetail}
          ownerNickname={ownerNickname}
          isPlaying={isPlaying}
          overlayRef={overlayRef}
          onClose={closeModal}
          onToggleAudio={toggleAudio}
        />
      </div>

      <BottomNavigation
        totalPages={
          isSharedBoard && sharedBoardData?.data
            ? sharedBoardData.data.totalPages
            : totalPages
        }
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        ownerNickname={ownerNickname}
        isSharedBoard={isSharedBoard}
        shareUri={shareUri}
        bottomGroupRef={bottomGroupRef}
        onShareClick={openShareModal}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
        onKakaoShare={handleKakaoShare}
        onLinkCopy={handleLinkCopy}
        showCopyFeedback={showCopyFeedback}
      />

      {/* Background bottom image */}
      <img
        src={bgbottom}
        alt=""
        aria-hidden
        className="pointer-events-none fixed left-1/2 z-10 w-full max-w-[450px]"
        style={{
          bottom: 46,
          transform: "translateX(-50%)",
          height: "auto",
          maxHeight: "70px",
        }}
      />

      {/* Drawer Icon */}
      <img
        src={drawerIcon}
        alt=""
        aria-hidden
        className="pointer-events-none fixed z-10 max-w-[450px]"
        style={{
          bottom: 65 + 19,
          right: screenWidth >= 450 ? `calc(50% - 225px)` : 0,
        }}
      />

      {/* Bonsai Icon - positioned 5px left of Hat */}
      <div
        className="pointer-events-none fixed z-10"
        style={{
          bottom: 65 + 150,
          right: screenWidth >= 450 ? `calc(50% - 225px + 36px)` : 36,
          width: "fit-content",
        }}
      >
        <img
          src={isNewYear ? bonsaiNewYear : bonsaiNormal}
          alt=""
          aria-hidden
          style={{ width: 68, height: "auto", display: "block" }}
        />
      </div>

      {/* Hat Icon - 31px clipped on right, 6px below drawer top */}
      <div
        className="pointer-events-none fixed z-10"
        style={{
          bottom: 65 + 105,
          right: screenWidth >= 450 ? `calc(50% - 225px)` : 0,
          width: "fit-content",
          overflow: "hidden",
        }}
      >
        <div style={{ marginRight: -31 }}>
          <HatIcon />
        </div>
      </div>

      {/* LP Icon - positioned at center right */}
      <button
        type="button"
        onClick={() => setIsLpPlaying(!isLpPlaying)}
        className="fixed z-10 cursor-pointer"
        style={{
          top: `calc(50% - ${(1 - heightRatio) * 50}px)`,
          transform: "translateY(-50%)",
          right: screenWidth >= 450 ? `calc(50% - 225px + 18px)` : 18,
        }}
        aria-label={isLpPlaying ? "LP 정지" : "LP 재생"}
      >
        <img
          src={isLpPlaying ? LpPlayingIcon : LpNormalIcon}
          alt=""
          aria-hidden
          style={{ width: 80, height: "auto", display: "block" }}
        />
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsSidebarOpen(false);
              }
            }}
            aria-label="사이드바 닫기"
          />
          <Sidebar
            nickname={ownerNickname}
            onClose={() => setIsSidebarOpen(false)}
            shareUri={
              isSharedBoard ? shareUri : currentUserBoard?.data?.shareUri
            }
          />
        </div>
      )}

      {/* Toast */}
      <Toast
        isOpen={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default BoardPage;
