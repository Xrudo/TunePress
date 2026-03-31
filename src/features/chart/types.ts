export interface Artist {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
  // tag.gettopartists omits listeners/playcount — treat as optional
  stats?: { listeners: string; playcount: string };
}

export interface ChartResponse {
  artists: {
    artist: Artist[];
    '@attr': { page: string; perPage: string; totalPages: string; total: string };
  };
}
