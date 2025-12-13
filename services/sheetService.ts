import Papa from 'papaparse';
import { MenuItem, SheetRow } from '../types';
import { FALLBACK_MENU, GOOGLE_SHEET_CSV_URL } from '../constants';

export const fetchMenuData = async (): Promise<MenuItem[]> => {
  // If no URL is provided, return fallback immediately
  if (!GOOGLE_SHEET_CSV_URL) {
    console.warn("No Google Sheet URL provided, using fallback data.");
    return new Promise((resolve) => setTimeout(() => resolve(FALLBACK_MENU), 800)); // Simulate delay
  }

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) throw new Error('Failed to fetch sheet');

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<SheetRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const menuItems: MenuItem[] = results.data
            .filter(row => row.Name && row.PriceReg) // Basic validation
            .map((row, index) => ({
              id: `sheet-${index}`,
              category: row.Category || 'Others',
              name: row.Name,
              description: row.Description || '',
              priceReg: parseFloat(row.PriceReg.replace(/[^0-9.]/g, '')),
              priceMed: row.PriceMed ? parseFloat(row.PriceMed.replace(/[^0-9.]/g, '')) : undefined,
              image: row.ImageURL
            }));

          // If no valid menu items were parsed, use fallback data
          if (menuItems.length === 0) {
            console.warn("No valid menu items found in sheet, using fallback data.");
            resolve(FALLBACK_MENU);
          } else {
            resolve(menuItems);
          }
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (err) {
    console.error("Error fetching menu data:", err);
    // Fallback on error to ensure app is usable
    return FALLBACK_MENU;
  }
};
