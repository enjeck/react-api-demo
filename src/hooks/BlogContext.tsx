import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { BlogPost, CreateBlogPostInput } from '../types/blog';
import { useBlogPosts } from './useBlogPosts';

interface BlogContextValue {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  actionError: string | null;
  creating: boolean;
  deletingId: number | null;
  retry: () => void;
  clearActionError: () => void;
  createPost: (input: CreateBlogPostInput) => Promise<boolean>;
  removePost: (id: number) => Promise<boolean>;
}

const BlogContext = createContext<BlogContextValue | null>(null);

export function BlogProvider({ children }: { children: ReactNode }) {
  const value = useBlogPosts();
  return <BlogContext value={value}>{children}</BlogContext>;
}

export function useBlogContext(): BlogContextValue {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlogContext must be used within BlogProvider');
  return ctx;
}
