import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { BlogPost } from '../types/blog';
import { fetchBlogPost } from '../services/api';

export function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const data = await fetchBlogPost(Number(id));
        if (!cancelled) setPost(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load post');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="detail">
        <Link to="/" className="detail__back">&larr; All posts</Link>
        <div className="detail__skeleton">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-date" style={{ marginBottom: '1.5rem' }} />
          <div className="skeleton-line skeleton-content-1" />
          <div className="skeleton-line skeleton-content-1" />
          <div className="skeleton-line skeleton-content-2" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="detail">
        <Link to="/" className="detail__back">&larr; All posts</Link>
        <div className="error-banner">
          <p className="error-banner__message">
            <span className="error-banner__icon">⚠</span> {error ?? 'Post not found'}
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="detail">
      <Link to="/" className="detail__back">&larr; All posts</Link>
      <article className="detail__article">
        <h1 className="detail__title">{post.title}</h1>
        <div className="detail__meta">
          <time dateTime={post.publishedAt}>{formattedDate}</time>
          <span className="post-author">by {post.author}</span>
        </div>
        <div className="detail__content">{post.content}</div>
      </article>
    </div>
  );
}
