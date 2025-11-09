export interface MusicSearchApiResponse {
  songTitle: string;
  artist: string;
  coverImage: string;
  songUrl: string;
  itunesUrl: string;
  youtubeUrl: string;
}

export interface PopularChartApiResponse {
  musicId: string;
  songTitle: string;
  artist: string;
  coverImage: string;
  songUrl: string;
  score: number;
  itunesUrl: string;
}

export interface MusicSearchData {
  searchResult: MusicSearchApiResponse[];
}
