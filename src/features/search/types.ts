export interface SearchArtist {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  image: Array<{ '#text': string; size: string }>;
}

export interface SearchResponse {
  results: {
    artistmatches: {
      artist: SearchArtist[];
    };
  };
}
