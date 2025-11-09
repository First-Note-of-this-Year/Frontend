import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "@/assets/ic_logo.svg?react";
import LogoNewYearIcon from "@/assets/ic_logo_newyear.svg?react";
import StarIcon from "@/assets/ic_star.svg?react";
import { DDayCounter } from "@/pages/loginPage/components/dday-counter";
import { KakaoLoginButton } from "@/pages/loginPage/components/kakao-login-button";
import { NewYearCountdown } from "@/pages/loginPage/components/new-year-countdown";
import { PopularMusicChart } from "@/pages/loginPage/components/popular-music-chart";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTimeStore } from "@/stores/useTimeStore";

function LoginPage() {
  const { isNewYear } = useTimeStore();
  const navigate = useNavigate();
  const { isLoggedIn, isCheckingAuth, hasFetchedAuth, checkAuth } =
    useAuthStore();

  // 화면 높이 가져오기
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 850;
  const rawRatio = screenHeight / 850;
  const heightRatio = Math.max(0.3, Math.min(1, rawRatio * rawRatio));

  // 각 요소의 기준 값
  const baseLogoTop = 33;
  const baseChartMarginBottom = 26;
  const baseCounterTop = 230;
  const baseHappyNewYearTop = 170;

  // 비율에 따라 조정된 값
  const logoTop = baseLogoTop * heightRatio;
  const chartMarginBottom = baseChartMarginBottom * heightRatio;
  const counterTop = baseCounterTop * heightRatio;
  const happyNewYearTop = baseHappyNewYearTop * heightRatio;

  useEffect(() => {
    if (!hasFetchedAuth && !isCheckingAuth) {
      void checkAuth();
    }
  }, [checkAuth, hasFetchedAuth, isCheckingAuth]);

  const isAuthResolved = hasFetchedAuth && !isCheckingAuth;

  const handleKakaoLogin = () => {
    try {
      window.location.href = `${import.meta.env.VITE_SERVER_URL}/oauth2/authorization/kakao`;
    } catch (error) {
      console.error("카카오 로그인 URL 생성 실패:", error);
      alert("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleGoToBoard = () => {
    navigate("/board");
  };

  if (isNewYear) {
    return (
      <div
        className="relative flex min-h-screen flex-col"
        style={{ minHeight: "100dvh" }}
      >
        <div
          className="flex justify-center"
          style={{ marginTop: `${logoTop}px` }}
        >
          <LogoNewYearIcon />
        </div>

        {/* Happy New Year 텍스트 */}
        <div
          className="-translate-x-1/2 absolute left-1/2"
          style={{ top: `${happyNewYearTop}px` }}
        >
          <span className="whitespace-nowrap font-bold font-year text-[44px] text-gray-100">
            Happy New Year
          </span>
        </div>

        {/* 카운터 */}
        <div
          className="-translate-x-1/2 absolute left-1/2 flex justify-center"
          style={{ top: `${counterTop}px` }}
        >
          <NewYearCountdown />
        </div>

        <div className="mt-auto flex flex-col items-center pb-10">
          <PopularMusicChart chartMarginBottom={chartMarginBottom} />

          {/* 로그인 상태에 따른 버튼 */}
          <div className="flex w-full justify-center">
            {isAuthResolved && (
              isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleGoToBoard}
                  className="flex flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-[#8E2D2D] px-[136px] py-3 font-semibold text-white transition-colors hover:bg-[#7A2525]"
                  style={{ maxWidth: "390px" }}
                >
                  LP 보드판으로 이동
                </button>
              ) : (
                <KakaoLoginButton onClick={handleKakaoLogin} />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ minHeight: "100dvh" }}
    >
      {/* 좌측 상단 별들 */}
      <div className="absolute top-2 left-4 z-10">
        <div className="flex flex-col gap-2">
          <StarIcon className="star-twinkle-1 ml-20 h-10 w-8 text-white" />
          <StarIcon className="star-twinkle-2 h-10 w-8 text-white" />
          <StarIcon className="star-twinkle-3 mt-10 ml-2 h-10 w-8 text-white" />
        </div>
      </div>

      {/* 우측 상단 별들 */}
      <div className="absolute right-1 z-10">
        <div className="flex flex-col items-end gap-2">
          <StarIcon className="star-twinkle-4 mr-2 h-8 w-8 text-white" />
          <StarIcon className="star-twinkle-5 mr-16 h-8 w-8 text-white" />
          <StarIcon className="star-twinkle-6 h-8 w-8 text-white" />
          <StarIcon className="star-twinkle-7 mt-6 mr-10 h-8 w-8 text-white" />
        </div>
      </div>

      {/* 로고 */}
      <div className="dynamic-padding-top flex flex-1 items-start justify-center">
        <div className="flex flex-col items-center">
          <LogoIcon
            style={{
              width: "210px",
              height: "auto",
              minWidth: "210px",
              maxWidth: "210px",
              flexShrink: 0,
            }}
          />
          <p
            className="mt-[10px] text-center text-white text-xs"
            style={{ fontSize: "12px" }}
          >
            새해 첫 곡을 친구에게 선물하고
            <br /> LP판에 쪽지를 새기는 특별한 롤링페이퍼 서비스
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse items-center justify-center pb-10">
        {/* 로그인 상태에 따른 버튼 */}
        <div className="flex w-full justify-center">
          {isAuthResolved && (
            isLoggedIn ? (
              <button
                type="button"
                onClick={handleGoToBoard}
                className="flex flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-[#8E2D2D] px-[136px] py-3 font-semibold text-white transition-colors hover:bg-[#7A2525]"
                style={{ maxWidth: "390px" }}
              >
                LP 보드판으로 이동
              </button>
            ) : (
              <KakaoLoginButton onClick={handleKakaoLogin} />
            )
          )}
        </div>

        {/* 디데이 표기 창 */}
        <div className="mb-6">
          <DDayCounter />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
