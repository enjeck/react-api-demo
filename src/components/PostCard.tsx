import type { BlogPost } from '../types/blog';

interface PostCardProps {
  post: BlogPost;
  deleting: boolean;
  onRequestDelete: (post: BlogPost) => void;
}

export function PostCard({ post, deleting, onRequestDelete }: PostCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="post-card">
      <div className="post-meta">
        <time dateTime={post.publishedAt}>{formattedDate}</time>
        <span className="post-author">by {post.author}</span>
        <button
          className="post-delete"
          onClick={() => onRequestDelete(post)}
          disabled={deleting}
          aria-label={`Delete post ${post.title}`}
        >
          {deleting ? (
            <span className="post-delete__status">...</span>
          ) : (
            <svg
              className="post-delete__icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M9 3.75h6m-8.25 3h10.5m-9.75 0 .6 11.1a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4l.6-11.1m-6 2.25v6.75m3-6.75v6.75"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>
    </article>
  );
}
