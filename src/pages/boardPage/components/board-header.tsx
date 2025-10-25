import BoardNoteIcon from "@/assets/ic_board_note.svg?react";
import HamburgerIcon from "@/assets/ic_hamburger.svg?react";
import HeaderIcon from "@/assets/ic_header_logo.svg?react";

interface TimeRemaining {
  d: number;
  h: number;
  m: number;
  s: number;
}

interface BoardHeaderProps {
  ownerNickname: string;
  messageCount?: number;
  timeRemaining: TimeRemaining;
  screenWidth: number;
  profileImage?: string;
  frameCenter: { x: number; y: number };
  onMenuClick: () => void;
}

export function BoardHeader({
  ownerNickname,
  messageCount,
  timeRemaining,
  screenWidth,
  onMenuClick,
}: BoardHeaderProps) {
  // 화면 높이 가져오기
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 850;
  const rawRatio = screenHeight / 850;
  const heightRatio = Math.max(0.3, Math.min(1, rawRatio * rawRatio));

  // 좌우 여백 계산 (390px 기준, 이하에서 급격히 감소)
  const horizontalPadding =
    screenWidth >= 390 ? 26 : Math.max(5, 26 - (390 - screenWidth) * 0.1);

  // 각 요소의 기준 top 값
  const baseLogoTop = 17;
  const baseHamburgerTop = 26;
  const baseTimerTop = 26;
  const baseTitleTop = screenHeight * 0.1 + 20;

  // 비율에 따라 조정된 top 값
  const logoTop = baseLogoTop * heightRatio;
  const hamburgerTop = baseHamburgerTop * heightRatio;
  const timerTop = baseTimerTop * heightRatio;
  const titleTop = baseTitleTop * heightRatio;

  return (
    <>
      {/* Header Logo */}
      <div
        className="fixed z-40"
        style={{
          top: logoTop,
          left:
            screenWidth >= 450
              ? `calc(50% - 225px + ${horizontalPadding}px)`
              : horizontalPadding,
        }}
      >
        <HeaderIcon />
      </div>

      {/* Hamburger Menu */}
      <button
        type="button"
        onClick={onMenuClick}
        className="fixed z-40 cursor-pointer"
        style={{
          top: hamburgerTop,
          right:
            screenWidth >= 450
              ? `calc(50% - 225px + ${horizontalPadding}px)`
              : horizontalPadding,
        }}
        aria-label="메뉴 열기"
      >
        <HamburgerIcon />
      </button>

      {/* Countdown Timer */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          top: timerTop,
          zIndex: 40,
        }}
      >
        <span className="text-[12px] text-brown-200">
          {`${timeRemaining.d} D ${timeRemaining.h} H ${timeRemaining.m} M ${timeRemaining.s} S`}
        </span>
      </div>

      {/* Board Title and Count */}
      <div
        className="fixed z-40"
        style={{
          top: titleTop,
          left:
            screenWidth >= 450
              ? `calc(50% - 225px + ${horizontalPadding}px)`
              : horizontalPadding,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="font-primary text-[28px] text-brown-200">
            {ownerNickname} 님의 {screenHeight > 620 && <br />}LP 보드판
          </span>
        </div>
        <div
          className="flex items-center"
          style={{
            width: 98,
            height: 25,
            marginTop: 12 * heightRatio,
          }}
        >
          <div
            className="flex items-center gap-1 px-2"
            style={{
              background: "rgba(69, 48, 45, 0.1)",
              color: "#412716",
              height: 25,
              fontSize: 12,
              borderRadius: 6,
              width: 98,
            }}
          >
            <BoardNoteIcon style={{ width: 12, height: 12 }} />
            <span className="ml-1 whitespace-nowrap font-bold">
              총 {messageCount ?? "00"} 개 음반
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
