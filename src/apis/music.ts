import { API_ENDPOINTS } from "@/apis/config/endpoints";
import { apiGet } from "@/lib/api";
import type { Music } from "@/types/music";
import type {
  MusicSearchData,
  PopularChartApiResponse,
} from "@/apis/types/music";
import type { ApiResponse } from "@/types/api";

export const getPopularMusicCharts = async (): Promise<Music[]> => {
  const response = await apiGet<ApiResponse<PopularChartApiResponse[]>>(
    API_ENDPOINTS.MUSIC.POPULAR_CHART
  );

  if (response?.data) {
    return response.data.map((item) => ({
      musicId: item.musicId,
      musicTitle: item.songName,
      artist: item.artist,
      musicCoverUrl: item.albumImageUrl,
      musicUrl: item.songUrl,
      score: item.score,
    }));
  }
  return [];
};

export const getSearchedSongs = async (query?: string): Promise<Music[]> => {
  const params = query ? { keyword: query } : undefined;
  const response = await apiGet<ApiResponse<MusicSearchData>, { keyword?: string }>(
    API_ENDPOINTS.MUSIC.SEARCH,
    params
  );

  if (response?.data?.searchResult) {
    return response.data.searchResult.map((item) => ({
      musicId: item.prestreamingUrl || `${item.songTitle}-${item.artist}`,
      musicTitle: item.songTitle,
      artist: item.artist,
      musicCoverUrl: item.coverImage,
      musicUrl: item.prestreamingUrl,
      prestreamingUrl: item.prestreamingUrl,
    }));
  }
  return [];
};
