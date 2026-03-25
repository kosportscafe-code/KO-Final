import { BlogPost } from '../types';

const BLOG_STORAGE_KEY = 'kos_blog_posts';

// Fallback initial data so it's not empty
const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'welcome-to-ko-sports-cafe-meerut',
    title: 'Experience World-Class Sports & Dining at KOS Sports Café Meerut',
    content: `
      <p><strong>Summary:</strong> KOS Sports Café Near Rohta Road on NH58, Meerut, is the premier hybrid destination for live sports screenings, competitive gaming, and specialized multi-cuisine dining. We combine high-energy entertainment with premium culinary craftsmanship.</p>
      
      <h2>The Ultimate Sports Screening Destination</h2>
      <p>At KOS Sports Café, we've designed a viewing experience that rivals being at the stadium. Our dedicated sports screening zone features massive high-definition displays and a curated seating layout that ensures every guest has the best seat in the house. We regularly screen major international cricket tournaments, football leagues, and premier sports events, creating a communal hub for fans in Meerut.</p>
      
      <h2>Premium Gaming and Interactive Entertainment</h2>
      <h3>High-End Gaming Consoles</h3>
      <p>For the gaming enthusiasts, we offer dedicated zones equipped with the latest consoles. Whether you're looking to challenge friends or refine your skills, our gaming atmosphere provides a professional and immersive environment tailored for the modern gamer.</p>
      
      <h3>Live Events and Standup Comedy</h3>
      <p>Beyond the screen and console, KOS Sports Café is a center for performing arts and community laughter. We frequently host live standup comedy shows featuring national and local talent. Experience the best of Meerut's nightlife with our curated event calendar. Check our <a href="/events">Upcoming Live Shows</a> to book your tickets in advance.</p>
      
      <h2>Specialized Multi-Cuisine Menu: Italian, Mexican, and Indian</h2>
      <p>Our kitchen specializations reflect our commitment to world-class quality. Guests can indulge in authentic hand-tossed Italian pizzas, spicy Mexican snacks, and our famous specialized Indian Thalis. Every ingredient is sourced for premium quality, ensuring a dining experience that complements our high-energy atmosphere. Explore our full <a href="/menu">Food & Drinks Menu</a> for our latest seasonal offerings.</p>
      
      <h2>Location and Booking Information</h2>
      <p>You can find us <strong>Near Rohta Road on NH58, Meerut</strong>. We are open daily from 11:00 AM to 11:00 PM. We recommend early reservations for big match days and comedy events. <a href="/contact">Reserve your table</a> today and experience the ultimate fusion of sports and taste.</p>
    `,
    excerpt: 'KOS Sports Café Near Rohta Road on NH58, Meerut, offers the best live sports screenings, premium gaming, and specialized multi-cuisine...',
    image: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80',
    category: 'Events',
    author: 'KOS Team',
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
