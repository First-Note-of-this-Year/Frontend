import { API_ENDPOINTS } from "@/apis/config/endpoints";
import type {
  MusicSearchData,
  PopularChartApiResponse,
} from "@/apis/types/music";
import { apiGet } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Music } from "@/types/music";

export const getPopularMusicCharts = async (): Promise<Music[]> => {
  const response = await apiGet<ApiResponse<PopularChartApiResponse[]>>(
    API_ENDPOINTS.MUSIC.POPULAR_CHART
  );

  if (response?.data) {
    return response.data.map((item) => ({
      musicId: item.musicId,
      songTitle: item.songTitle,
      artist: item.artist,
      coverImage: item.coverImage,
      songUrl: item.songUrl,
      score: item.score,
      itunesUrl: item.itunesUrl,
    }));
  }
  return [];
};

export const getSearchedSongs = async (query?: string): Promise<Music[]> => {
  const params = query ? { keyword: query } : undefined;
  const response = await apiGet<
    ApiResponse<MusicSearchData>,
    { keyword?: string }
  >(API_ENDPOINTS.MUSIC.SEARCH, params);

  if (response?.data?.searchResult) {
    return response.data.searchResult.map((item) => ({
      musicId: item.itunesUrl || `${item.songTitle}-${item.artist}`,
      songTitle: item.songTitle,
      artist: item.artist,
      coverImage: item.coverImage,
      itunesUrl: item.itunesUrl,
      youtubeUrl: item.youtubeUrl,
    }));
  }
  return [];
};
