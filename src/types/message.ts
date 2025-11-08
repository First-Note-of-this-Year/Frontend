export interface MessageData {
  shareUri: string;
  sender: string;
  content: string;
  songTitle: string;
  artist: string;
  coverImage: string;
  songUrl: string;
  itunesUrl?: string;
  youtubeUrl?: string;
  mine?: boolean;
}
