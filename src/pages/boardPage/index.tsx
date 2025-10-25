import { useState } from "react";
import { useParams } from "react-router-dom";
import bgbottom from "@/assets/bg_bottom.webp";
import drawerIcon from "@/assets/ic_drawer.webp";
import HatIcon from "@/assets/ic_hat.svg?react";
import LpNormalIcon from "@/assets/ic_lp_normal.svg?react";
import LpPlayingIcon from "@/assets/ic_lp_playing.svg?react";
import windowIcon from "@/assets/ic_window_normal.webp";
import { Sidebar } from "@/components/ui/sidebar";
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
    setLetterOpenId,
    messageDetail,
    isPlaying,
    toggleAudio,
    closeModal,
  } = useLetterModal(isSharedBoard, boardList, sharedBoardData);

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{
        paddingTop: 140,
        paddingBottom: 0,
      }}
    >
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
          <img src={windowIcon} alt="" aria-hidden />
        </div>
      </div>

      <BoardHeader
        ownerNickname={ownerNickname}
        messageCount={
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
          onAlbumClick={setLetterOpenId}
          screenWidth={screenWidth}
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
          top: "50%",
          transform: "translateY(-50%)",
          right: screenWidth >= 450 ? `calc(50% - 225px + 18px)` : 18,
        }}
        aria-label={isLpPlaying ? "LP 정지" : "LP 재생"}
      >
        {isLpPlaying ? <LpPlayingIcon /> : <LpNormalIcon />}
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
    </div>
  );
}

export default BoardPage;
