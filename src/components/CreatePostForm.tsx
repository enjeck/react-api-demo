import { useState } from 'react';
import type { CreateBlogPostInput } from '../types/blog';

interface CreatePostFormProps {
  creating: boolean;
  onCreate: (input: CreateBlogPostInput) => Promise<boolean>;
  onCancel: () => void;
}

export function CreatePostForm({ creating, onCreate, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextAuthor = author.trim();
    const nextContent = content.trim();

    if (!nextTitle || !nextAuthor || !nextContent) {
      return;
    }

    const created = await onCreate({
      title: nextTitle,
      author: nextAuthor,
      content: nextContent,
    });

    if (created) {
      setTitle('');
      setAuthor('');
      setContent('');
    }
  }

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <div className="create-post__row">
        <input
          className="create-post__input"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={creating}
        />
        <input
          className="create-post__input"
          type="text"
          placeholder="Author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          disabled={creating}
        />
      </div>

      <textarea
        className="create-post__textarea"
        placeholder="Write the post content..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={creating}
        rows={4}
      />

      <div className="create-post__actions">
        <button className="create-post__cancel" type="button" onClick={onCancel} disabled={creating}>
          Cancel
        </button>
        <button className="create-post__submit" type="submit" disabled={creating}>
          {creating ? 'Creating...' : 'Create post'}
        </button>
      </div>
    </form>
  );
}
