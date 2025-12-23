import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CDPlayerImage from "@/assets/obj_cdplayer.webp";
import { NavigationButton } from "@/components/ui/navigation-button";
import { PageLayout } from "@/components/ui/page-layout";
import { useAuthStore } from "@/stores/useAuthStore";

export default function JoinCompletePage() {
  const navigate = useNavigate();
  const { isLoggedIn, checkAuth, hasFetchedAuth, boardShare } = useAuthStore();

  useEffect(() => {
    if (!hasFetchedAuth) {
      void checkAuth();
    }
  }, [checkAuth, hasFetchedAuth]);

  const handleToBoard = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    
    if (!boardShare?.boardId) {
      // 보드 정보가 없으면 인증을 다시 시도
      void checkAuth({ force: true }).then((data) => {
        if (data?.boardId) {
          navigate("/board");
        } else {
          navigate("/join/nickname");
        }
      });
      return;
    }
    
    navigate("/board");
  };

  return (
    <PageLayout
      title={
        <>
          나만의 LP 보드가
          <br />
          만들어졌어요! <br />
          지금 확인하러 갈까요?
        </>
      }
      showBackButton={false}
      bottomContent={
        <NavigationButton className="w-full" active={true} onClick={handleToBoard}>
          다음으로
        </NavigationButton>
      }
    >
      <img src={CDPlayerImage} alt="CD Player" className="mx-auto" />
    </PageLayout>
  );
}
