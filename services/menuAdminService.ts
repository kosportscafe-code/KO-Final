import { MenuItem } from '../types';

const MENU_STORAGE_KEY = 'kos_menu_items_v2';

/**
 * Returns admin modified menu items if they exist.
 */
export const getAdminMenuItems = (): MenuItem[] | null => {
  try {
    const data = localStorage.getItem(MENU_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse menu items from local storage', error);
    return null;
  }
};

/**
 * Replaces the entire menu list in storage.
 */
export const saveAdminMenu = (items: MenuItem[]): void => {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
};

/**
 * Saves or updates a single menu item in storage.
 */
export const saveAdminMenuItem = (item: MenuItem): void => {
  const items = getAdminMenuItems() || [];
  const existingIndex = items.findIndex((i) => i.id === item.id);
  
  if (existingIndex >= 0) {
    // Update existing
    items[existingIndex] = item;
  } else {
    // Add to top if it's new
    items.unshift(item);
  }
  
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
};

/**
 * Deletes a menu item by ID.
 */
export const deleteAdminMenuItem = (id: string): void => {
  const items = getAdminMenuItems() || [];
  const filtered = items.filter((i) => i.id !== id);
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Utility to generate unique ID for new menu items.
 */
export const generateItemId = (): string => {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
