import { useEffect, useState } from 'react';
import axios from 'axios';

const cache = new Map<string, string>();

async function fetchThumb(name: string): Promise<string> {
  if (cache.has(name)) return cache.get(name)!;
  try {
    const slug = encodeURIComponent(name.replace(/ /g, '_'));
    const { data } = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`,
      { params: { redirect: true } }
    );
    const url: string = data.thumbnail?.source ?? '';
    cache.set(name, url);
    return url;
  } catch {
    cache.set(name, '');
    return '';
  }
}

export function useWikipediaImages(names: string[]): Map<string, string> {
  const [images, setImages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (names.length === 0) return;
    let cancelled = false;

    const key = names.join('|');
    void key; // used only to trigger effect on list change

    Promise.allSettled(names.map((n) => fetchThumb(n).then((url) => ({ n, url }))))
      .then((results) => {
        if (cancelled) return;
        setImages((prev) => {
          const next = new Map(prev);
          for (const r of results) {
            if (r.status === 'fulfilled' && r.value.url) {
              next.set(r.value.n, r.value.url);
            }
          }
          return next;
        });
      });

    return () => { cancelled = true; };
  }, [names.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  return images;
}
