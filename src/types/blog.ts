export interface BlogPost {
  id: number;
  title: string;
  author: string;
  content: string;
  publishedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  author: string;
  content: string;
}
