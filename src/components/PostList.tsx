import type { BlogPost } from '../types/blog';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: BlogPost[];
  deletingId: number | null;
  onRequestDelete: (post: BlogPost) => void;
}

export function PostList({ posts, deletingId, onRequestDelete }: PostListProps) {
  if (posts.length === 0) {
    return <p className="empty-state">No posts match your search.</p>;
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          deleting={deletingId === post.id}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </div>
  );
}
