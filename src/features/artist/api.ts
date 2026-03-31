import axios from 'axios';
import type { ArtistDetail, TopTracksResponse } from './types';

const BASE = 'https://ws.audioscrobbler.com/2.0/';
const KEY = import.meta.env.VITE_LASTFM_API_KEY;

export const fetchArtistInfo = async (name: string): Promise<ArtistDetail> => {
  const { data } = await axios.get<{ artist: ArtistDetail }>(BASE, {
    params: { method: 'artist.getinfo', artist: name, api_key: KEY, format: 'json' },
  });
  return data.artist;
};

export const fetchTopTracks = async (name: string): Promise<TopTracksResponse> => {
  const { data } = await axios.get<TopTracksResponse>(BASE, {
    params: { method: 'artist.gettoptracks', artist: name, api_key: KEY, format: 'json', limit: 5 },
  });
  return data;
};
