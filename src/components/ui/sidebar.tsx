import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/apis/auth";
import { getBoardInfo } from "@/apis/board";
import HeadsetIcon from "@/assets/ic_headset.svg?react";
import MusicNoteIcon from "@/assets/ic_music_note.svg?react";
import PersonIcon from "@/assets/ic_person.svg?react";
import QusetionIcon from "@/assets/ic_question.svg?react";
import SignOutIcon from "@/assets/ic_sign_out.svg?react";
import XIcon from "@/assets/ic_x.svg?react";
import { Alert } from "@/components/ui/alert";
import { useOverlayContext } from "@/pages/boardPage/context/OverlayContext";
import { useAuthStore } from "@/stores/useAuthStore";

interface SidebarProps {
  nickname?: string;
  onClose?: () => void;
  shareUri?: string;
}

export function Sidebar({
  nickname = "닉네임",
  onClose,
  shareUri,
}: SidebarProps) {
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const {
    isLoggedIn,
    isCheckingAuth,
    hasFetchedAuth,
    checkAuth,
    reset: resetAuth,
  } = useAuthStore();

  const { data: boardInfo } = useQuery({
    queryKey: ["boardInfo", shareUri],
    queryFn: () => getBoardInfo(shareUri as string),
    enabled: Boolean(shareUri),
  });

  const navigate = useNavigate();
  const isSharedBoard = Boolean(shareUri);

  useEffect(() => {
    // 공유 보드가 아닌 경우에만 인증 체크
    if (!isSharedBoard && !hasFetchedAuth && !isCheckingAuth) {
      void checkAuth();
    }
  }, [isSharedBoard, checkAuth, hasFetchedAuth, isCheckingAuth]);

  const handleLogoutClick = () => {
    setShowLogoutAlert(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      resetAuth();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
    setShowLogoutAlert(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutAlert(false);
  };

  const handleNavigateProfile = () => {
    navigate("/user/profile");
  };

  const handleNavigateInquiry = () => {
    navigate("/user/inquiry");
  };

  const { setShowOverlay } = useOverlayContext();

  const handleUsageClick = () => {
    onClose?.();
    setShowOverlay(true);
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  const isAuthLoading = isCheckingAuth && !hasFetchedAuth;

  if (isAuthLoading) {
    return (
      <div className="relative h-dvh w-72 flex-shrink-0 overflow-hidden rounded-tl-[10px] rounded-bl-[10px] bg-neutral-100">
        <div className="mx-[14px] my-[14px] flex h-[calc(100dvh-28px)] w-52 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-neutral-800" />
            <p className="font-medium text-neutral-600 text-sm">확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 비로그인 상태 UI
  if (!isLoggedIn) {
    return (
      <div className="relative h-dvh w-72 flex-shrink-0 overflow-hidden rounded-tl-[10px] rounded-bl-[10px] bg-neutral-100">
        <div className="mx-[14px] my-[14px] flex h-[calc(100dvh-28px)] w-52 flex-col">
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={onClose}
              className="relative h-6 w-6 cursor-pointer overflow-hidden transition-opacity hover:opacity-70"
            >
              <div className="absolute top-[4.12px] left-[4.12px] flex h-6 w-6 items-center justify-center rounded-sm">
                <XIcon className="text-white" />
              </div>
            </button>

            <div className="flex flex-col items-center justify-center gap-6 py-20">
              <div className="text-center">
                <div className="mb-2 font-bold text-neutral-800 text-xl leading-7 tracking-wide">
                  로그인이 필요합니다
                </div>
                <div className="text-neutral-600 text-sm">
                  서비스를 이용하시려면
                  <br />
                  로그인해주세요
                </div>
              </div>
              <button
                type="button"
                onClick={handleLoginClick}
                className="w-full rounded-lg bg-neutral-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-700"
              >
                로그인하기
              </button>
            </div>
          </div>

          <div className="absolute bottom-[14px] left-[14px] flex w-52 flex-col gap-2">
            <div className="font-semibold text-[8px] text-neutral-500 leading-3 tracking-tight">
              Copyright ©firstsori. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 상태 UI
  return (
    <div className="relative h-dvh w-72 flex-shrink-0 overflow-hidden rounded-tl-[10px] rounded-bl-[10px] bg-neutral-100">
      <div className="mx-[14px] my-[14px] flex h-[calc(100dvh-28px)] w-52 flex-col">
        <div className="flex flex-col gap-6">
          <button
            type="button"
            onClick={onClose}
            className="relative h-6 w-6 cursor-pointer overflow-hidden transition-opacity hover:opacity-70"
          >
            <div className="absolute top-[4.12px] left-[4.12px] flex h-6 w-6 items-center justify-center rounded-sm">
              <XIcon className="text-white" />
            </div>
          </button>

          <div className="flex flex-row items-center gap-3">
            <div className="relative h-16 w-16">
              {boardInfo?.data?.profileImage ? (
                <img
                  src={boardInfo.data.profileImage}
                  alt="프로필 이미지"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-300" />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="font-bold text-neutral-800 text-xl leading-7 tracking-wide">
                {boardInfo?.data?.nickname || nickname} 님
              </div>
              <div className="inline-flex w-fit items-center gap-1 rounded bg-stone-300/30 px-2 py-2 backdrop-blur-[3.02px]">
                <div className="relative h-3 w-3 overflow-hidden">
                  <MusicNoteIcon />
                </div>
                <div className="text-center font-bold text-xs text-zinc-800 leading-none">
                  총 {boardInfo?.data?.messageCount ?? 0}개 음반
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-0 w-60 outline outline-[#E6E6E6] outline-offset-[-0.50px]" />
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleNavigateProfile}
                className="flex h-12 w-full items-center gap-3 overflow-hidden py-2 text-left transition-colors hover:bg-neutral-200"
              >
                <div className="relative h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-red-900/5 backdrop-blur-[9.75px]" />
                  <PersonIcon className="absolute top-[10px] left-[10px] h-5 w-5" />
                </div>
                <div className="font-semibold text-base text-neutral-800 leading-snug tracking-wide">
                  마이 프로필
                </div>
              </button>
            </div>
            <div className="h-0 w-60 outline outline-[#E6E6E6] outline-offset-[-0.50px]" />
            <button
              type="button"
              onClick={handleUsageClick}
              className="flex h-12 w-full items-center gap-3 overflow-hidden py-2 text-left transition-colors hover:bg-neutral-200"
            >
              <div className="relative h-10 w-10">
                <div className="h-10 w-10 rounded-full bg-red-900/5 backdrop-blur-[9.75px]" />
                <QusetionIcon className="absolute top-[10px] left-[10px] h-5 w-5" />
              </div>
              <div className="font-semibold text-base text-black leading-snug tracking-wide">
                사용 방법
              </div>
            </button>
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleNavigateInquiry}
                className="flex h-12 w-full items-center gap-3 overflow-hidden py-2 text-left transition-colors hover:bg-neutral-200"
              >
                <div className="relative h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-red-900/5 backdrop-blur-[9.75px]" />
                  <HeadsetIcon className="absolute top-[10px] left-[10px] h-5 w-5" />
                </div>
                <div className="font-semibold text-base text-black leading-snug tracking-wide">
                  문의사항
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[14px] left-[14px] flex w-52 flex-col gap-2">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="flex h-12 w-full items-center gap-3 overflow-hidden py-2 text-left transition-colors hover:bg-neutral-200"
          >
            <div className="relative h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-red-900/5 backdrop-blur-[9.75px]" />
              <SignOutIcon className="absolute top-[10px] left-[10px] h-5 w-5" />
            </div>
            <div className="font-semibold text-base text-black leading-snug tracking-wide">
              로그아웃
            </div>
          </button>
          <div className="h-0 w-60 outline outline-[#E6E6E6] outline-offset-[-0.50px]" />

          <div className="font-semibold text-[8px] text-neutral-500 leading-3 tracking-tight">
            Copyright ©firstsori. All rights reserved.
          </div>
        </div>
      </div>

      <Alert
        isOpen={showLogoutAlert}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        leftButtonText="취소"
        rightButtonText="로그아웃"
        content="로그아웃하시겠습니까?"
      />
    </div>
  );
}
