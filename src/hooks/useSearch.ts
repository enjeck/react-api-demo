import { useMemo, useState } from 'react';
import type { BlogPost } from '../types/blog';

type SortDirection = 'desc' | 'asc';

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  sortDir: SortDirection;
  toggleSort: () => void;
  filtered: BlogPost[];
}

export function useSearch(posts: BlogPost[]): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const toggleSort = () => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));

  const filtered = useMemo(() => {
    let result = posts;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      );
    }

    result = [...result].sort((a, b) => {
      const diff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      return sortDir === 'desc' ? diff : -diff;
    });

    return result;
  }, [posts, query, sortDir]);

  return { query, setQuery, sortDir, toggleSort, filtered };
}
