export interface MusicSearchApiResponse {
  songTitle: string;
  artist: string;
  coverImage: string;
  prestreamingUrl: string;
}

export interface PopularChartApiResponse {
  musicId: string;
  songName: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
  score: number;
}

export interface MusicSearchData {
  searchResult: MusicSearchApiResponse[];
}
