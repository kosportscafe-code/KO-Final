/**
 * Gallery Service for KOS Sports Cafe
 * Handles Cloudinary fetching/upload and Instagram feed sync.
 */

// CLOUDINARY CONFIG
const CLOUD_NAME = 'douefch8u'; 
const UPLOAD_PRESET = 'kosc_upload';

export interface GalleryItem {
  id: string;
  url: string;
  category: 'food' | 'events' | 'sports';
  description?: string;
  width: number;
  height: number;
  createdAt: string;
}

/**
 * Fetches gallery images from Cloudinary.
 * Note: Requires "Resource List" enabled in Cloudinary Settings -> Security.
 * Fallback: Returning a mock list if API is not accessible yet.
 */
export const fetchGalleryImages = async (category: string = 'all'): Promise<GalleryItem[]> => {
  try {
    // We use tags for client-side listing in Cloudinary.
    // If user organizes by folders, we expect them to also have categories as tags.
    const tag = category === 'all' ? 'kosc-gallery' : `kosc-gallery-${category}`;
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;
    console.log(`[Gallery] Syncing with Cloudinary: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
        if (response.status === 404) {
            console.warn(`[Gallery] Resource list not found for tag: ${tag}. \n1. Go to Cloudinary Settings > Security.\n2. In "Restricted media types", uncheck "Resource list".\n3. Click Save.`);
        } else {
            console.warn(`[Gallery] Fetch failed with status: ${response.status}`);
        }
        return getMockGalleryData(category);
    }

    const data = await response.json();
    return data.resources.map((res: any) => ({
      id: res.public_id,
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${res.public_id}.${res.format}`,
      category: res.context?.custom?.category || 'general',
      width: res.width,
      height: res.height,
      createdAt: res.created_at
    }));
  } catch (error) {
    console.error('Error fetching Cloudinary gallery:', error);
    return getMockGalleryData(category);
  }
};

/**
 * Fetches latest Instagram posts.
 * Note: Requires Instagram Basic Display API integration.
 * Returning mock data for now.
 */
export const fetchInstagramPosts = async () => {
  // In a real scenario, we'd fetch from a worker or backend to proxy Instagram API.
  return [
    { id: 'ig1', url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599', link: '#', caption: 'Big game tonight!' },
    { id: 'ig2', url: 'https://images.unsplash.com/photo-1585699324551-f6c30f065779', link: '#', caption: 'Comedy night highlights' },
    { id: 'ig3', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', link: '#', caption: 'New healthy bowls!' },
  ];
};

/**
 * MOCK DATA for initial setup
 */
const getMockGalleryData = (category: string): GalleryItem[] => {
    const all: GalleryItem[] = [
        { id: 'm1', url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?auto=format&fit=crop&q=80&w=800', category: 'food' as const, width: 800, height: 600, createdAt: new Date().toISOString() },
        { id: 'm2', url: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800', category: 'sports' as const, width: 800, height: 600, createdAt: new Date().toISOString() },
        { id: 'm3', url: 'https://images.unsplash.com/photo-1585699324551-f6c30f065779?auto=format&fit=crop&q=80&w=800', category: 'events' as const, width: 800, height: 600, createdAt: new Date().toISOString() },
        { id: 'm4', url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?auto=format&fit=crop&q=80&w=800', category: 'food' as const, width: 800, height: 600, createdAt: new Date().toISOString() },
    ];
    if (category === 'all') return all;
    return all.filter(i => i.category === category);
};

/**
 * Opens the Cloudinary Upload Widget.
 */
export const openUploadWidget = (category: string, callback: (url: string) => void) => {
  if (!(window as any).cloudinary) {
    console.error('Cloudinary widget not loaded');
    return;
  }

  (window as any).cloudinary.openUploadWidget({
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    folder: `kosc-gallery/${category}`,
    tags: ['kosc-gallery', `kosc-gallery-${category}`],
    clientAllowedFormats: ['jpg', 'png', 'webp'],
    maxFileSize: 20000000, // Increased to 20MB
    context: { category }, // Store category in metadata
  }, (error: any, result: any) => {
    if (!error && result && result.event === "success") {
      callback(result.info.secure_url);
    }
  });
};
