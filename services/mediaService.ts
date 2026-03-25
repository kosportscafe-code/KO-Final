export interface MediaItem {
  id: string;
  filename: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
  sizeBytes: number;
}

const MEDIA_STORAGE_KEY = 'kos_media_uploads';

export const getMediaItems = (): MediaItem[] => {
  try {
    const data = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to parse media items from localStorage', error);
    return [];
  }
};

export const saveMediaItem = (item: MediaItem): void => {
  const items = getMediaItems();
  items.unshift(item);
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
};

export const deleteMediaItem = (id: string): void => {
  const items = getMediaItems();
  const filtered = items.filter((i) => i.id !== id);
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(filtered));
};
