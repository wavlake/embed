export interface EmbedProps {
  trackData: TrackData[];
}

export interface TrackData {
  id: string;
  title: string;
  artist: string;
  artistUrl: string;
  artistArtworkUrl: string;
  artistVerified: boolean;
  albumTitle: string;
  albumId: string;
  artworkUrl: string;
  playCount: number;
  liveUrl: string;
  deleted: boolean;
}