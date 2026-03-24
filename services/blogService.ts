import { BlogPost } from '../types';

const BLOG_STORAGE_KEY = 'kos_blog_posts';

// Fallback initial data so it's not empty
const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'welcome-to-ko-sports-cafe',
    title: 'Welcome to KO Sports Cafe!',
    content: '<p>Experience the ultimate fusion of sports, entertainment, and great food. Join us for live screenings of your favorite matches and hilarious standup comedy events.</p>',
    excerpt: 'Experience the ultimate fusion of sports, entertainment, and great food...',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80',
    category: 'Sports',
    author: 'KO Admin',
    createdAt: new Date().toISOString()
  }
];

export const getBlogPosts = (): BlogPost[] => {
  try {
    const data = localStorage.getItem(BLOG_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Set initial data if empty
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  } catch (error) {
    console.error('Failed to parse blog posts from local storage', error);
    return INITIAL_POSTS;
  }
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getBlogPosts();
  return posts.find((p) => p.slug === slug);
};

export const saveBlogPost = (post: BlogPost): void => {
  const posts = getBlogPosts();
  const existingIndex = posts.findIndex((p) => p.id === post.id);
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post); // add to top
  }
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
};

export const deleteBlogPost = (id: string): void => {
  const posts = getBlogPosts();
  const filtered = posts.filter((p) => p.id !== id);
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filtered));
};

// Utility to create a URL-friendly slug
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};
