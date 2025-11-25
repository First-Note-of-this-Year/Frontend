import { useEffect, useId, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BoardNoteIcon from "@/assets/ic_board_note.svg?react";
import CheckIcon from "@/assets/ic_check_neutral.svg?react";
import ClickIcon from "@/assets/ic_click.svg?react";
import HamburgerIcon from "@/assets/ic_hamburger.svg?react";
import HeaderIcon from "@/assets/ic_header_logo.svg?react";
import QuestionIcon from "@/assets/ic_question.svg?react";
import SquareIcon from "@/assets/ic_square_neutral.svg?react";
import GuideIcon from "@/assets/ic_x_guide.svg?react";
import { useTimeStore } from "@/stores/useTimeStore";
import { useOverlayManager } from "../hooks/useOverlayManager";

interface TimeRemaining {
  d: number;
  h: number;
  m: number;
  s: number;
}

interface BoardHeaderProps {
  ownerNickname: string;
  messagesCount?: number;
  timeRemaining: TimeRemaining;
  screenWidth: number;
  profileImage?: string;
  frameCenter: { x: number; y: number };
  onMenuClick: () => void;
  shelfWrapperRef?: React.RefObject<HTMLDivElement | null>;
}

export function BoardHeader({
  ownerNickname,
  messagesCount,
  timeRemaining,
  screenWidth,
  onMenuClick,
  shelfWrapperRef,
}: BoardHeaderProps) {
  const { isAfterNewYear } = useTimeStore();
  const navigate = useNavigate();
  const questionRef = useRef<HTMLButtonElement | null>(null);

  const {
    showOverlay,
    setShowOverlay,
    dontShowChecked,
    setDontShowChecked,
    albumHoleRect,
    questionHoleRect,
    linkHoleRect,
    lpHoleRect,
  } = useOverlayManager({ questionRef, shelfWrapperRef });

  const maskId = useId();
  const QUESTION_HOLE_PADDING = 0;
  const QUESTION_HOLE_RADIUS = 4;
  const LP_HOLE_INSET = 5;
  const LP_HOLE_RADIUS = 8;

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

  // Request hole rects from other components when overlay opens so they can
  // respond with their bounding rects (link-share, LP button, etc.). We
  // re-request on next tick and after a short delay to avoid mount-order races.
  useEffect(() => {
    if (!showOverlay) return;
    try {
      window.dispatchEvent(new CustomEvent("boardOverlayRequestHoleRect"));
    } catch {}
    // next tick
    setTimeout(() => {
      try {
        window.dispatchEvent(new CustomEvent("boardOverlayRequestHoleRect"));
      } catch {}
    }, 0);
    // short delay
    setTimeout(() => {
      try {
        window.dispatchEvent(new CustomEvent("boardOverlayRequestHoleRect"));
      } catch {}
    }, 150);
  }, [showOverlay]);

  return (
    <>
      {/* Header Logo */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="fixed z-20 cursor-pointer transition-opacity hover:opacity-70"
        style={{
          top: logoTop,
          left:
            screenWidth >= 450
              ? `calc(50% - 225px + ${horizontalPadding}px)`
              : horizontalPadding,
        }}
        aria-label="홈으로 이동"
      >
        <HeaderIcon />
      </button>

      {/* Hamburger Menu */}
      <button
        type="button"
        onClick={onMenuClick}
        className="fixed z-20 cursor-pointer"
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

      {/* Countdown Timer / Happy New Year */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          top: timerTop,
          zIndex: 20,
        }}
      >
        {isAfterNewYear ? (
          <span className="font-normal font-year text-[24px] text-brown-200">
            HAPPY NEW YEAR
          </span>
        ) : (
          <span className="text-[12px] text-brown-200">
            {`${timeRemaining.d} D ${timeRemaining.h} H ${timeRemaining.m} M ${timeRemaining.s} S`}
          </span>
        )}
      </div>

      {/* Board Title and Count */}
      <div
        className="fixed z-20"
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
            <button
              ref={questionRef}
              type="button"
              aria-label="도움말"
              onClick={() => setShowOverlay(true)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                marginLeft: 16,
                display: "inline-block",
                cursor: "pointer",
              }}
            >
              <QuestionIcon
                style={{ width: 24, height: 24, display: "block" }}
              />
            </button>
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
              총 {messagesCount ?? "00"} 개 음반
            </span>
          </div>
        </div>
      </div>

      {showOverlay && (
        <>
          {/* SVG overlay with punched hole (from holeRect) so clicks inside hole pass through */}
          <button
            type="button"
            aria-label="close-overlay"
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowOverlay(false);
            }}
            onClick={() => setShowOverlay(false)}
            // raise overlay background above pagination (z-40) but keep it below overlay controls (z-50+)
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              width: "100%",
              height: "100%",
            }}
          >
            <svg role="presentation" style={{ width: "100%", height: "100%" }}>
              <defs>
                <mask id={maskId}>
                  <rect x={0} y={0} width="100%" height="100%" fill="white" />
                  {albumHoleRect && (
                    <rect
                      x={Math.max(0, albumHoleRect.x - QUESTION_HOLE_PADDING)}
                      y={Math.max(0, albumHoleRect.y - QUESTION_HOLE_PADDING)}
                      width={albumHoleRect.width + QUESTION_HOLE_PADDING * 2}
                      height={albumHoleRect.height + QUESTION_HOLE_PADDING * 2}
                      rx={QUESTION_HOLE_RADIUS}
                      ry={QUESTION_HOLE_RADIUS}
                      fill="black"
                    />
                  )}
                  {questionHoleRect && (
                    <rect
                      x={Math.max(
                        0,
                        questionHoleRect.x - QUESTION_HOLE_PADDING
                      )}
                      y={Math.max(
                        0,
                        questionHoleRect.y - QUESTION_HOLE_PADDING
                      )}
                      width={questionHoleRect.width + QUESTION_HOLE_PADDING * 2}
                      height={
                        questionHoleRect.height + QUESTION_HOLE_PADDING * 2
                      }
                      rx={QUESTION_HOLE_RADIUS}
                      ry={QUESTION_HOLE_RADIUS}
                      fill="black"
                    />
                  )}
                  {linkHoleRect && (
                    <rect
                      x={linkHoleRect.x}
                      y={linkHoleRect.y}
                      width={linkHoleRect.width}
                      height={linkHoleRect.height}
                      fill="black"
                    />
                  )}
                  {lpHoleRect && (
                    <rect
                      x={Math.max(0, lpHoleRect.x + LP_HOLE_INSET)}
                      y={Math.max(0, lpHoleRect.y + LP_HOLE_INSET)}
                      width={Math.max(0, lpHoleRect.width - LP_HOLE_INSET * 2)}
                      height={Math.max(
                        0,
                        lpHoleRect.height - LP_HOLE_INSET * 2
                      )}
                      rx={LP_HOLE_RADIUS}
                      ry={LP_HOLE_RADIUS}
                      fill="black"
                    />
                  )}
                </mask>
              </defs>

              <rect
                x={0}
                y={0}
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.7)"
                mask={`url(#${maskId})`}
              />
            </svg>
          </button>

          {albumHoleRect && (
            <div
              style={{
                position: "fixed",
                left:
                  albumHoleRect.x +
                  albumHoleRect.width +
                  QUESTION_HOLE_PADDING +
                  12,
                // align top of the box with the top of the album
                top: albumHoleRect.y,
                zIndex: 80,
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  height: 32,
                  padding: "0 10px",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ color: "#ffffff", fontWeight: 600, fontSize: 14 }}
                >
                  받은 편지
                </span>
              </div>

              <div style={{ marginTop: 4 }}>
                <span
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                >
                  {isAfterNewYear
                    ? "받은 편지를 눌러서 확인해요"
                    : "(새해 이후에 볼 수 있어요)"}
                </span>
              </div>
            </div>
          )}

          {questionHoleRect && (
            <div
              style={{
                position: "fixed",
                left:
                  questionHoleRect.x +
                  questionHoleRect.width +
                  QUESTION_HOLE_PADDING +
                  12,
                top: questionHoleRect.y,
                zIndex: 80,
                pointerEvents: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 4,
                  height: 32,
                  padding: "0 10px",
                  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{ color: "#ffffff", fontWeight: 600, fontSize: 14 }}
                >
                  사용 방법 다시보기
                </span>
              </div>
            </div>
          )}

          {/* BGM ON/OFF label (moved from index.tsx) - only show while overlay is active */}
          <div
            style={{
              position: "fixed",
              // shift the box up so its top edge aligns with the LP icon top
              top: `calc(50% - ${(1 - heightRatio) * 50}px - 18px)`,
              transform: "translateY(-50%)",
              right:
                screenWidth >= 450
                  ? `calc(50% - 225px + 18px + 80px + 12px)`
                  : 110,
              zIndex: 80,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 4,
                height: 32,
                padding: "0 10px",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 600, fontSize: 14 }}>
                BGM ON/OFF
              </span>
            </div>
          </div>
          {/* ic_click button: 48px from right, slightly below LP icon */}
          <button
            type="button"
            aria-label="click-hint"
            onClick={() => {
              /* placeholder: no-op or could trigger a tutorial action */
            }}
            style={{
              position: "fixed",
              top: `calc(50% - ${(1 - heightRatio) * 50}px + 40px)`,
              transform: "translateY(-50%)",
              right: screenWidth >= 450 ? `calc(50% - 225px + 48px)` : 48,
              zIndex: 80,
              pointerEvents: "auto",
              border: "none",
              background: "transparent",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ClickIcon style={{ width: 62, height: 82, display: "block" }} />
          </button>

          <div
            aria-hidden={false}
            style={{
              position: "fixed",
              zIndex: 50,
              left:
                screenWidth <= 450
                  ? 20
                  : screenWidth >= 450
                    ? `calc(50% - 225px + ${horizontalPadding}px)`
                    : horizontalPadding,
              top: screenWidth <= 450 ? 19 : logoTop,
            }}
          >
            <button
              type="button"
              aria-label="close-guide"
              onClick={() => setShowOverlay(false)}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GuideIcon style={{ width: 36, height: 36, display: "block" }} />
            </button>
          </div>

          <div
            style={{
              position: "fixed",
              zIndex: 60,
              // follow same horizontal placement logic as the hamburger/menu (right side)
              right:
                screenWidth >= 450
                  ? `calc(50% - 225px + ${horizontalPadding}px)`
                  : 18,
              top: 21,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 4,
                height: 32,
                padding: "0 10px",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: 600, fontSize: 14 }}>
                다시 보지 않기
              </span>

              <button
                type="button"
                aria-pressed={dontShowChecked}
                aria-label={dontShowChecked ? "checked" : "unchecked"}
                onClick={() => setDontShowChecked(!dontShowChecked)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {dontShowChecked ? (
                  <CheckIcon
                    style={{ width: 24, height: 24, display: "block" }}
                  />
                ) : (
                  <SquareIcon
                    style={{ width: 24, height: 24, display: "block" }}
                  />
                )}
              </button>
            </div>
          </div>
          {/* Centered bottom helper box */}
          <div
            style={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 62,
              zIndex: 80,
              pointerEvents: "auto",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 4,
                height: 32,
                padding: "0 12px",
                width: 232,
                boxSizing: "border-box",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 14,
                  whiteSpace: "nowrap",
                }}
              >
                다른 사람한테 공유할 링크를 복사해요
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
