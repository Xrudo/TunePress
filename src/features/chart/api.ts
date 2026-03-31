import axios from 'axios';
import type { ChartResponse } from './types';

const BASE = 'https://ws.audioscrobbler.com/2.0/';
const KEY = import.meta.env.VITE_LASTFM_API_KEY;

export const fetchTopArtists = async (): Promise<ChartResponse> => {
  const { data } = await axios.get<ChartResponse>(BASE, {
    params: { method: 'chart.gettopartists', api_key: KEY, format: 'json', limit: 20 },
  });
  return data;
};
