import axios from 'axios';
import type { SearchResponse } from './types';

const BASE = 'https://ws.audioscrobbler.com/2.0/';
const KEY = import.meta.env.VITE_LASTFM_API_KEY;

export const searchArtists = async (query: string): Promise<SearchResponse> => {
  const { data } = await axios.get<SearchResponse>(BASE, {
    params: { method: 'artist.search', artist: query, api_key: KEY, format: 'json' },
  });
  return data;
};

