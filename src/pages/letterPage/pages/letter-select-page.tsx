import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBoardInfo } from "@/apis/board";
import ITunesBadge from "@/assets/btn_iTunes_Badge.svg?react";
import PauseIcon from "@/assets/ic_pause.svg?react";
import PlayIcon from "@/assets/ic_play.svg?react";
import { NavigationButton } from "@/components/ui/navigation-button";
import { PageLayout } from "@/components/ui/page-layout";
import { useAudio } from "@/hooks/useAudio";
import type { Music } from "@/types/music";
import LetterStep from "../components/letter-step";

interface LetterSelectPageProps {
  nickname?: string;
  music?: Music;
}

const MARQUEE_REPEAT = [1, 2, 3, 4] as const;

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
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isPlaying, playAudio, stopAudio } = useAudio();

  const isJoinPage = location.pathname.startsWith("/join/");
  const isFirstTimeJoin = location.pathname === "/join/letter/select";

  const displayedMusic = localMusic ?? music;

  useEffect(() => {
    if (textRef.current && containerRef.current && displayedMusic?.songTitle) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [displayedMusic?.songTitle]);

  useEffect(() => {
    const fetchBoardInfo = async () => {
      // join 페이지에서는 보드 정보를 가져올 필요 없음
      if (!shareUri || isJoinPage) return;
      try {
        const response = await getBoardInfo(shareUri);
        setRecipientNickname(response.data.nickname);
      } catch (error) {
        console.error("Failed to fetch board info:", error);
      }
    };

    fetchBoardInfo();
  }, [shareUri, isJoinPage]);

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
        songTitle: (parsed.songTitle as string) ?? "",
        artist: (parsed.artist as string) ?? "",
        coverImage: (parsed.coverImage as string) ?? "",
        songUrl: (parsed.songUrl as string) ?? "",
        itunesUrl: (parsed.itunesUrl as string) ?? "",
        youtubeUrl: (parsed.youtubeUrl as string) ?? "",
      };

      console.log("mapped music:", mapped); // 디버그용
      setLocalMusic(mapped);
    } catch (err) {
      // ignore malformed data
      // eslint-disable-next-line no-console
      console.warn("Failed to parse messageDraft from localStorage:", err);
    }
  }, [music]);

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

  const handleToggleAudio = () => {
    if (!displayedMusic?.songUrl) return;

    if (isPlaying) {
      stopAudio();
    } else {
      playAudio(displayedMusic.songUrl).catch((error) => {
        console.error("Failed to play audio:", error);
      });
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

      <div className="relative z-10 mx-auto flex w-60 flex-col gap-4">
        <div className="relative flex h-60 w-60 items-center justify-center self-center rounded bg-white/10 backdrop-blur-md">
          {displayedMusic?.coverImage ? (
            <img
              aria-label="album-cover"
              className="h-52 w-52"
              src={displayedMusic.coverImage}
            />
          ) : (
            <div className="h-52 w-52 rounded bg-gray-500" />
          )}
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex flex-1 flex-row items-center gap-1 overflow-hidden rounded-md bg-black/10 px-4 py-3 backdrop-blur-md">
            <div ref={containerRef} className="min-w-0 flex-1 overflow-hidden">
              <div
                ref={textRef}
                className={`inline-flex whitespace-nowrap text-base text-white ${shouldAnimate ? "animate-marquee" : "justify-center"}`}
              >
                {shouldAnimate ? (
                  MARQUEE_REPEAT.map((num) => (
                    <span key={num} className="inline-block px-2">
                      {displayedMusic?.songTitle ?? "곡 제목"}
                    </span>
                  ))
                ) : (
                  <span>{displayedMusic?.songTitle ?? "곡 제목"}</span>
                )}
              </div>
            </div>

            <p className="whitespace-nowrap text-gray-200 text-xs">
              {displayedMusic?.artist && displayedMusic.artist.length > 4
                ? `${displayedMusic.artist.slice(0, 4)}...`
                : (displayedMusic?.artist ?? "가수")}
            </p>
          </div>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 backdrop-blur-md"
            onClick={handleToggleAudio}
            aria-label={isPlaying ? "pause" : "play"}
          >
            {isPlaying ? <PauseIcon className="text-white" /> : <PlayIcon />}
          </button>
        </div>

        {displayedMusic?.itunesUrl && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <a
              href={displayedMusic.itunesUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on iTunes Store"
            >
              <ITunesBadge className="h-4" />
            </a>
            <p className="text-center text-white/60 text-xs">
              Provided courtesy of iTunes
            </p>
          </div>
        )}
      </div>

      {displayedMusic?.coverImage ? (
        <img
          aria-label="album-cover"
          className="-translate-x-1/2 -bottom-22 absolute left-1/2 z-0 h-44 w-44 transform"
          src={displayedMusic.coverImage}
        />
      ) : (
        <div className="-translate-x-1/2 -bottom-20 absolute left-1/2 h-40 w-40 transform bg-gray-500" />
      )}
    </PageLayout>
  );
}
