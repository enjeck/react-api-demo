import type { BlogPost, CreateBlogPostInput } from '../types/blog';

const API_URL = 'https://api.mydummyapi.com/categories/blogs';

function normalizePost(
  value: Partial<BlogPost>,
  fallback?: CreateBlogPostInput,
): BlogPost {
  return {
    id: Number(value.id ?? 0),
    title: value.title ?? fallback?.title ?? '',
    author: value.author ?? fallback?.author ?? 'Unknown',
    content: value.content ?? fallback?.content ?? '',
    publishedAt: value.publishedAt ?? new Date().toISOString(),
  };
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: Partial<BlogPost>[] = await response.json();
  return data.map((post) => normalizePost(post));
}

export async function createBlogPost(input: CreateBlogPostInput): Promise<BlogPost> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Create request failed with status ${response.status}`);
  }

  const data: Partial<BlogPost> = await response.json();
  return normalizePost(data, input);
}

export async function fetchBlogPost(id: number): Promise<BlogPost> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: Partial<BlogPost> = await response.json();
  return normalizePost(data);
}

export async function deleteBlogPost(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`Delete request failed with status ${response.status}`);
  }
}
