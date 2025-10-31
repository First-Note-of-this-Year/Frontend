import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBoardInfo } from "@/apis/board";
import PlayIcon from "@/assets/ic_play.svg?react";
import { NavigationButton } from "@/components/ui/navigation-button";
import { PageLayout } from "@/components/ui/page-layout";
import type { Music } from "@/types/music";
import LetterStep from "../components/letter-step";

interface LetterSelectPageProps {
  nickname?: string;
  music?: Music;
}

export default function LetterSelectPage({
  nickname = "닉네임",
  music,
}: LetterSelectPageProps) {
  const navigate = useNavigate();
  const { shareUri } = useParams();
  const location = useLocation();
  const [recipientNickname, setRecipientNickname] = useState(nickname);
  // local music loaded from search draft if `music` prop isn't provided
  const [localMusic, setLocalMusic] = useState<Music | undefined>(music);

  const isJoinPage = location.pathname.startsWith("/join/");
  const isFirstTimeJoin = location.pathname === "/join/letter/select";

  useEffect(() => {
    const fetchBoardInfo = async () => {
      if (!shareUri) return;
      try {
        const response = await getBoardInfo(shareUri);
        setRecipientNickname(response.data.name);
      } catch (error) {
        console.error("Failed to fetch board info:", error);
      }
    };

    fetchBoardInfo();
  }, [shareUri]);

  useEffect(() => {
    // prefer prop `music` if provided
    if (music) {
      setLocalMusic(music);
      return;
    }

    try {
      const raw = localStorage.getItem("messageDraft");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;

      console.log("localStorage data:", parsed); // 디버그용

      const mapped: Music = {
        // mapping from localStorage data structure
        musicId: (parsed.musicId as string) ?? "",
        musicTitle: (parsed.songTitle as string) ?? "",
        artist: (parsed.artist as string) ?? "",
        musicCoverUrl: (parsed.albumImageUrl as string) ?? "",
        musicUrl: (parsed.songUrl as string) ?? "",
        prestreamingUrl: (parsed.prestreamingUrl as string) ?? "",
      };

      console.log("mapped music:", mapped); // 디버그용
      setLocalMusic(mapped);
    } catch (err) {
      // ignore malformed data
      // eslint-disable-next-line no-console
      console.warn("Failed to parse messageDraft from localStorage:", err);
    }
  }, [music]);

  const displayedMusic = localMusic ?? music;

  const handleClick = () => {
    if (isJoinPage) {
      if (isFirstTimeJoin) {
        navigate("/join/letter/write");
      } else {
        navigate(
          shareUri ? `/join/letter/write/${shareUri}` : "/join/letter/write"
        );
      }
    } else {
      navigate(shareUri ? `/letter/write/${shareUri}` : "/letter/write");
    }
  };

  return (
    <PageLayout
      title={
        isFirstTimeJoin ? (
          <>
            미래의 나에게 <br />이 노래를 들려드릴까요?{" "}
          </>
        ) : isJoinPage ? (
          <>
            미래의 나에게 <br /> 이 노래를 들려드릴까요?
          </>
        ) : (
          <>
            {recipientNickname} 님께 <br />이 노래를 들려드릴까요?
          </>
        )
      }
      bottomContent={
        <NavigationButton
          active={true}
          onClick={handleClick}
          className="w-full"
        >
          다음
        </NavigationButton>
      }
    >
      <LetterStep
        step={1}
        className="absolute top-0 right-0 pt-26 sm:pt-36 md:pt-40"
      />

      <div className="mx-auto flex w-60 flex-col gap-4">
        <div className="relative flex h-60 w-60 items-center justify-center self-center rounded bg-white/10 backdrop-blur-md">
          {displayedMusic?.musicCoverUrl ? (
            <img
              aria-label="album-cover"
              className="h-52 w-52"
              src={displayedMusic.musicCoverUrl}
            />
          ) : (
            <div className="h-52 w-52 rounded bg-gray-500" />
          )}
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex flex-1 flex-row items-center gap-1 rounded-md bg-white/10 px-4 py-3 backdrop-blur-md">
            <p className="text-base text-white">
              {displayedMusic?.musicTitle || "곡 제목"}
            </p>
            <p className="text-gray-500 text-xs">
              {displayedMusic?.artist || "가수"}
            </p>
          </div>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
          >
            <PlayIcon />
          </button>
        </div>
      </div>

      {displayedMusic?.musicCoverUrl ? (
        <img
          aria-label="album-cover"
          className="-translate-x-1/2 -bottom-22 absolute left-1/2 z-0 h-44 w-44 transform"
          src={displayedMusic.musicCoverUrl}
        />
      ) : (
        <div className="-translate-x-1/2 -bottom-20 absolute left-1/2 h-40 w-40 transform bg-gray-500" />
      )}
    </PageLayout>
  );
}
