import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getBoardInfo, getBoardShare, updateBoard } from "@/apis/board";
import CameraIcon from "@/assets/ic_camera.svg?react";
import DefaultProfileImage from "@/assets/obj_default_profile.svg?react";
import { BackButton } from "@/components/ui/back-button";
import { NavigationButton } from "@/components/ui/navigation-button";
import { NicknameInput } from "@/components/ui/nickname-input";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState("");
  const [, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [hasNicknameError, setHasNicknameError] = useState(false);

  const { data: shareData } = useQuery({
    queryKey: ["boardShare"],
    queryFn: getBoardShare,
  });

  const { data: boardInfo } = useQuery({
    queryKey: ["boardInfo", shareData?.data.shareUri],
    queryFn: () => getBoardInfo(shareData!.data.shareUri),
    enabled: !!shareData?.data.shareUri,
  });

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boardInfo"] });
      queryClient.invalidateQueries({ queryKey: ["boardShare"] });
      navigate("/board");
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    if (hasNicknameError) {
      alert("닉네임은 최대 6자까지 입력 가능합니다.");
      return;
    }

    // 닉네임이 입력되지 않았으면 그냥 뒤로가기
    if (!nickname || nickname.trim() === "") {
      navigate("/board");
      return;
    }

    // 기존 프로필 이미지를 함께 전송
    const currentProfileImage = boardInfo?.data.profileImage || "";
    updateBoardMutation.mutate({
      nickname,
      profileImage: currentProfileImage,
    });
  };

  return (
    <div
      className="relative flex min-h-screen flex-col justify-center bg-white p-8"
      style={{ minHeight: "100dvh" }}
    >
      <div className="relative mb-10 flex items-center justify-center">
        <BackButton className="absolute left-0" />
        <p className="font-bold text-base text-red-200">마이 프로필</p>
      </div>

      <div className="relative mx-auto mb-9 h-28 w-28 self-center">
        <div className="absolute top-0 left-0 h-28 w-28">
          {profileImagePreview ? (
            <img
              src={profileImagePreview}
              alt="프로필 이미지"
              className="h-full w-full rounded-full object-cover"
            />
          ) : boardInfo?.data.profileImage ? (
            <img
              src={boardInfo.data.profileImage}
              alt="프로필 이미지"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <DefaultProfileImage className="h-full w-full" />
          )}
        </div>
        <label
          htmlFor="profile-image-input"
          className="absolute top-[77px] left-[73px] h-10 w-10 cursor-pointer"
        >
          <div className="absolute top-0 left-0 h-10 w-10 rounded-full bg-neutral-400 backdrop-blur-[9.75px]" />
          <div className="absolute top-[10px] left-[10px] h-5 w-5 overflow-hidden">
            <CameraIcon />
          </div>
        </label>
        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <p className="mb-2 font-semibold text-base text-red-200">별명</p>
      <NicknameInput
        value={nickname}
        onChange={setNickname}
        onValidationChange={setHasNicknameError}
        placeholder={boardInfo?.data.nickname || "별명을 입력해주세요."}
      />
      <p className="mt-2 font-normal text-red-200 text-xs">
        영어 대/소문자, 특수 문자, 띄어쓰기 사용으로 최대 6자
      </p>

      <div className="z-10 mt-auto w-full">
        <NavigationButton
          onClick={handleComplete}
          active={!hasNicknameError}
          disabled={updateBoardMutation.isPending}
        >
          {updateBoardMutation.isPending ? "저장 중..." : "완료"}
        </NavigationButton>
      </div>
    </div>
  );
}
