import { useState, useEffect, useMemo } from 'react';
import { MenuItem } from '../types';
import { fetchMenuData } from '../services/menuService';

export interface StructuredMenuItem extends MenuItem {
  price: number; // Requested alias for priceReg
  image: string; // Requested alias for image_url
}

export const useMenuData = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchMenuData();
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch menu data'));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const structuredItems = useMemo<StructuredMenuItem[]>(() => {
    return items.map(item => ({
      ...item,
      price: Number(item.priceReg) || 0,
      image: item.image_url || '',
    }));
  }, [items]);

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(i => i.category)));
  }, [items]);

  return {
    items: structuredItems,
    categories,
    loading,
    error,
    rawItems: items // Providing raw items just in case
  };
};
