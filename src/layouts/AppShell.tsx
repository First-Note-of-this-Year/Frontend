import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTimeStore } from "@/stores/useTimeStore";
import { getNewYearBackground, routeBg } from "./backgrounds";

const getRouteBackground = (pathname: string) => {
  return (
    routeBg[pathname] ??
    Object.entries(routeBg).find(
      ([key]) => key !== "/" && pathname.startsWith(key)
    )?.[1]
  );
};

export default function AppShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { isNewYear, fetchServerTime } = useTimeStore();

  // 서버 시간 가져오기
  useEffect(() => {
    fetchServerTime();
  }, [fetchServerTime]);

  // 새해 기간이면 새해 배경, 아니면 기본 배경
  const bgUrl = isNewYear
    ? getNewYearBackground(pathname) ?? getRouteBackground(pathname)
    : getRouteBackground(pathname);

  const isLetterSearch =
    pathname === "/letter/search" ||
    pathname.startsWith("/join/letter/search") ||
    pathname.startsWith("/letter/search");
  const isUserPage = pathname.startsWith("/user");
  const isBoardPage = pathname.startsWith("/board");
  const isErrorPage =
    !routeBg[pathname] &&
    !Object.entries(routeBg).find(
      ([key]) => key !== "/" && pathname.startsWith(key)
    ) &&
    pathname !== "/letter/search" &&
    pathname !== "/";
  const shouldRemovePadding =
    isLetterSearch || isErrorPage || isUserPage || isBoardPage;

  return (
    <div
      className={`h-dvh overflow-hidden ${isLetterSearch ? "bg-white text-black" : pathname === "/" ? "bg-[#212E5A] text-white" : "bg-[#412716] text-white"}`}
      style={
        pathname === "/" && isNewYear
          ? {
              background:
                "linear-gradient(to bottom, #9C6A65 0%, #65659C 100%)",
            }
          : undefined
      }
    >
      <main
        className={`relative mx-auto h-full w-full max-w-[450px] bg-center bg-cover bg-no-repeat ${shouldRemovePadding ? "" : "p-4"}`}
        style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}
      >
        {children}
      </main>
    </div>
  );
}
