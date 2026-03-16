import { useState, useCallback } from 'react';
import type { BlogPost } from './types/blog';
import { useBlogPosts } from './hooks/useBlogPosts';
import { useSearch } from './hooks/useSearch';
import { usePagination } from './hooks/usePagination';
import { PostList } from './components/PostList';
import { Pagination } from './components/Pagination';
import { CreatePostForm } from './components/CreatePostForm';
import { Modal } from './components/Modal';
import './App.css';

export default function App() {
  const {
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
  } = useBlogPosts();
  const { query, setQuery, sortDir, toggleSort, filtered } = useSearch(posts);
  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  // Reset to page 1 whenever the search query changes.
  const handleQueryChange = useCallback(
    (q: string) => {
      setQuery(q);
      setPage(1);
    },
    [setQuery],
  );

  const { page: safePage, totalPages, pageItems, hasNext, hasPrev } = usePagination(
    filtered,
    page,
    setPage,
  );

  const openCreateModal = useCallback(() => {
    clearActionError();
    setIsCreateModalOpen(true);
  }, [clearActionError]);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const handleCreatePost = useCallback(
    async (input: { title: string; author: string; content: string }) => {
      const created = await createPost(input);
      if (created) {
        setIsCreateModalOpen(false);
      }
      return created;
    },
    [createPost],
  );

  const requestDelete = useCallback(
    (post: BlogPost) => {
      clearActionError();
      setPendingDelete(post);
    },
    [clearActionError],
  );

  const cancelDelete = useCallback(() => {
    if (deletingId !== null) return;
    setPendingDelete(null);
  }, [deletingId]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    const deleted = await removePost(pendingDelete.id);
    if (deleted) {
      setPendingDelete(null);
    }
  }, [pendingDelete, removePost]);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div className="post-list">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="post-card skeleton-card">
            <div className="post-meta">
              <span className="skeleton-line skeleton-date" />
              <span className="skeleton-line skeleton-author" />
            </div>
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-content-1" />
            <div className="skeleton-line skeleton-content-2" />
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="error-banner">
        <p className="error-banner__message">
          <span className="error-banner__icon">⚠</span> {error}
        </p>
        <button className="error-banner__retry" onClick={retry}>
          Retry
        </button>
      </div>
    );
  } else {
    content = (
      <>
        <PostList posts={pageItems} deletingId={deletingId} onRequestDelete={requestDelete} />
        <Pagination
          page={safePage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageChange={setPage}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Blog</h1>
        <button className="open-create-modal" onClick={openCreateModal}>
          + New post
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search posts..."
          className="search-input"
        />
      </div>

      <div className="toolbar">
        {query && (
          <div className="filter-indicator">
            <span>
              Showing {filtered.length} post{filtered.length !== 1 ? 's' : ''}
              {' '}matching <strong className="highlight">&ldquo;{query}&rdquo;</strong>
            </span>
            <button className="clear-button" onClick={() => handleQueryChange('')}>
              Clear
            </button>
          </div>
        )}
        <button className="sort-button" onClick={toggleSort}>
          {sortDir === 'asc' ? 'Oldest first' : 'Newest first'}
          <span className="sort-icon">{sortDir === 'asc' ? '▲' : '▼'}</span>
        </button>
      </div>

      {actionError && (
        <p className="action-error" role="alert">
          {actionError}
          <button className="action-error__dismiss" onClick={clearActionError}>
            Dismiss
          </button>
        </p>
      )}

      <div className="divider" />

      {content}

      {isCreateModalOpen && (
        <Modal title="Create blog post" onClose={closeCreateModal}>
          <CreatePostForm creating={creating} onCreate={handleCreatePost} onCancel={closeCreateModal} />
        </Modal>
      )}

      {pendingDelete && (
        <Modal title="Delete blog post" onClose={cancelDelete}>
          <p className="delete-confirm__message">
            Delete <strong>{pendingDelete.title}</strong> by {pendingDelete.author}?
          </p>
          <p className="delete-confirm__note">This action cannot be undone.</p>
          <div className="delete-confirm__actions">
            <button className="delete-confirm__cancel" onClick={cancelDelete} disabled={deletingId !== null}>
              Cancel
            </button>
            <button className="delete-confirm__confirm" onClick={() => void confirmDelete()} disabled={deletingId !== null}>
              {deletingId !== null ? 'Deleting...' : 'Delete post'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
