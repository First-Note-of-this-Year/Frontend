import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireBoard?: boolean;
}

export default function ProtectedRoute({
  children,
  redirectTo = ROUTES.BOARD,
  requireBoard = false,
}: ProtectedRouteProps) {
  const { shareUri } = useParams();
  const { isLoggedIn, isCheckingAuth, hasFetchedAuth, boardShare, checkAuth } =
    useAuthStore();
  const hasBoard = Boolean(boardShare?.boardId);

  const isPublicShare = Boolean(shareUri);

  useEffect(() => {
    if (!isPublicShare && !hasFetchedAuth && !isCheckingAuth) {
      void checkAuth();
    }
  }, [checkAuth, hasFetchedAuth, isCheckingAuth, isPublicShare]);

  if (isPublicShare) {
    return <>{children}</>;
  }

  const isLoading = isCheckingAuth || !hasFetchedAuth;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="font-medium text-gray-600 text-lg">확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  if (requireBoard && !hasBoard) {
    return <Navigate to={ROUTES.JOIN.NICKNAME} replace />;
  }

  if (!requireBoard && hasBoard) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
