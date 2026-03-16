import { useState, useEffect, useCallback } from 'react';
import type { BlogPost, CreateBlogPostInput } from '../types/blog';
import { fetchBlogPosts, createBlogPost, deleteBlogPost } from '../services/api';

interface UseBlogPostsReturn {
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

export function useBlogPosts(): UseBlogPostsReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const data = await fetchBlogPosts();
        if (!cancelled) {
          setPosts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const clearActionError = useCallback(() => setActionError(null), []);

  const createPost = useCallback(async (input: CreateBlogPostInput) => {
    setCreating(true);
    setActionError(null);

    try {
      const created = await createBlogPost(input);
      setPosts((current) => [created, ...current]);
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to create post');
      return false;
    } finally {
      setCreating(false);
    }
  }, []);

  const removePost = useCallback(async (id: number) => {
    setDeletingId(id);
    setActionError(null);

    try {
      await deleteBlogPost(id);
      setPosts((current) => current.filter((post) => post.id !== id));
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    actionError,
    creating,
    deletingId,
    retry,
    clearActionError,
    createPost,
    removePost,
  };
}
