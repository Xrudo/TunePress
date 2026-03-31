export interface ArtistDetail {
  name: string;
  mbid: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
  stats: { listeners: string; playcount: string };
  bio: { summary: string; content: string };
  tags: { tag: Array<{ name: string; url: string }> };
  similar: { artist: Array<{ name: string }> };
}

export interface Track {
  name: string;
  playcount: string;
  listeners: string;
  url: string;
  artist: { name: string };
}

export interface TopTracksResponse {
  toptracks: { track: Track[] };
}
