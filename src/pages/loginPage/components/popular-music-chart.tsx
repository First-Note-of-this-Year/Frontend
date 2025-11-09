import { useEffect, useState } from "react";
import { getPopularMusicCharts } from "@/apis/music";
import ChartBarIcon from "@/assets/ic_chartbar.svg?react";
import LandingPauseIcon from "@/assets/ic_landing_pause.svg?react";
import LandingPlayIcon from "@/assets/ic_landing_play.svg?react";
import { useAudio } from "@/hooks/useAudio";
import type { Music } from "@/types/music";

interface PopularMusicChartProps {
  chartMarginBottom: number;
}

export function PopularMusicChart({
  chartMarginBottom,
}: PopularMusicChartProps) {
  const [musicCharts, setMusicCharts] = useState<Music[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  const { isPlaying, playAudio, stopAudio } = useAudio();

  // 인기 차트 불러오기
  useEffect(() => {
    const fetchCharts = async () => {
      setLoading(true);
      try {
        const charts = await getPopularMusicCharts();
        setMusicCharts(charts);
      } catch (error) {
        console.error("Failed to fetch music charts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharts();
  }, []);

  // 컴포넌트 언마운트 시 오디오 정지
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <>
      {/* 차트바 아이콘 */}
      <div
        style={{
          width: "calc(100vw - 32px)",
          maxWidth: "361px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChartBarIcon />
        <span
          style={{
            marginLeft: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#F5F5F5",
          }}
        >
          올해의 첫 소리 TOP 10
        </span>
      </div>

      {/* 음악 차트 영역 */}
      <div
        className="overflow-y-auto"
        style={{
          width: "calc(100vw - 32px)",
          maxWidth: "361px",
          height: "236px",
          marginBottom: `${chartMarginBottom}px`,
        }}
      >
        {loading ? null : musicCharts.length > 0 ? (
          musicCharts.map((music, index) => (
            <div
              key={music.musicId}
              style={{
                width: "100%",
                height: "57px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                marginBottom: index < musicCharts.length - 1 ? "10px" : "0",
                borderRadius: "60px",
                display: "flex",
                alignItems: "center",
                padding: "0",
                paddingRight: "16px",
              }}
            >
              {/* 앨범 커버 */}
              <img
                src={music.coverImage}
                alt={music.songTitle}
                style={{
                  width: "57px",
                  height: "57px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "16px",
                }}
              />
              {/* 순위 */}
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "32px",
                  opacity: 0.5,
                  marginRight: "19px",
                  fontWeight: 500,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* 곡 정보 */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {music.songTitle}
                </p>
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 500,
                    opacity: 0.7,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {music.artist}
                </p>
              </div>
              {/* 재생/일시정지 버튼 */}
              <button
                type="button"
                onClick={() => {
                  // 현재 재생 중인 음악을 다시 클릭하면 정지
                  if (playingMusicId === music.musicId && isPlaying) {
                    stopAudio();
                    setPlayingMusicId(null);
                    return;
                  }

                  // 다른 음악을 선택하면 재생
                  setPlayingMusicId(music.musicId);
                  if (music.songUrl || music.itunesUrl) {
                    playAudio(music.songUrl || music.itunesUrl || "").catch(
                      (error) => {
                        console.error("Failed to play preview:", error);
                        setPlayingMusicId(null);
                      }
                    );
                  }
                }}
                style={{ marginLeft: "17px" }}
                aria-label={
                  playingMusicId === music.musicId && isPlaying
                    ? "일시정지"
                    : "재생"
                }
              >
                {playingMusicId === music.musicId && isPlaying ? (
                  <LandingPauseIcon />
                ) : (
                  <LandingPlayIcon />
                )}
              </button>
            </div>
          ))
        ) : (
          <div
            className="flex items-center justify-center text-white"
            style={{ height: "236px" }}
          >
            차트를 불러올 수 없습니다
          </div>
        )}
      </div>
    </>
  );
}
