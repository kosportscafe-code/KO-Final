import Papa from 'papaparse';
import { MenuItem, SheetRow } from '../types';
import { FALLBACK_MENU, GOOGLE_SHEET_CSV_URL } from '../constants';
import { getAdminMenuItems, saveAdminMenu } from './menuAdminService';

/**
 * Size label helper for different categories
 */
export const getSizeLabels = (category: string) => {
  if (['Sandwiches', 'Momos', 'Chinese & Noodles'].includes(category)) {
    return { reg: 'Half', med: 'Full', fullReg: 'Half', fullMed: 'Full' };
  }
  return { reg: 'Reg', med: 'Med', fullReg: 'Regular', fullMed: 'Medium' };
};

/**
 * Fetches menu data from Google Sheets or local admin storage
 */
export const fetchMenuData = async (): Promise<MenuItem[]> => {
  // Use admin local modifications if available
  const localItems = getAdminMenuItems();
  if (localItems && localItems.length > 0) {
    return localItems;
  }

  if (!GOOGLE_SHEET_CSV_URL) {
    console.warn("No Google Sheet URL provided, using fallback data.");
    saveAdminMenu(FALLBACK_MENU);
    return new Promise((resolve) => setTimeout(() => resolve(FALLBACK_MENU), 800));
  }

  try {
    const url = GOOGLE_SHEET_CSV_URL.includes('?') 
      ? `${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`
      : `${GOOGLE_SHEET_CSV_URL}?t=${new Date().getTime()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch sheet');

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse<SheetRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const menuItems: MenuItem[] = results.data
            .filter(row => row.Name && row.PriceReg)
            .map((row, index) => {
              const priceReg = parseFloat(row.PriceReg?.replace(/[^0-9.]/g, '') || '0');
              const priceMed = row.PriceMed ? parseFloat(row.PriceMed.replace(/[^0-9.]/g, '') || '0') : undefined;
              
              return {
                id: `sheet-${index}`,
                category: row.Category || 'Others',
                name: row.Name,
                description: row.Description || '',
                priceReg: isNaN(priceReg) ? 0 : priceReg,
                priceMed: priceMed !== undefined && isNaN(priceMed) ? 0 : priceMed,
                image_url: row.ImageURL,
                isVeg: true // Default to veg unless logic added
              };
            });

          if (menuItems.length === 0) {
            saveAdminMenu(FALLBACK_MENU);
            resolve(FALLBACK_MENU);
          } else {
            saveAdminMenu(menuItems);
            resolve(menuItems);
          }
        },
        error: (error: Error) => reject(error)
      });
    });
  } catch (err) {
    console.error("Error fetching menu data:", err);
    saveAdminMenu(FALLBACK_MENU);
    return FALLBACK_MENU;
  }
};

/**
 * Generates JSON-LD Schema for the menu
 */
export const generateMenuSchema = (items: MenuItem[]) => {
  if (items.length === 0) return null;

  const buildOffers = (item: MenuItem): any => {
    const availability = item.inStock !== false
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

    if (item.priceMed) {
      const labels = getSizeLabels(item.category);
      return [
        {
          "@type": "Offer",
          "name": labels.fullReg,
          "price": item.priceReg,
          "priceCurrency": "INR",
          "availability": availability
        },
        {
          "@type": "Offer",
          "name": labels.fullMed,
          "price": item.priceMed,
          "priceCurrency": "INR",
          "availability": availability
        }
      ];
    }
    return {
      "@type": "Offer",
      "price": item.priceReg,
      "priceCurrency": "INR",
      "availability": availability
    };
  };

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": "https://www.kosportscafe.com/#menu",
    "name": "KOS Sports Café Menu",
    "description": "Full food and drink menu at KOS Sports Café in Meerut.",
    "url": "https://www.kosportscafe.com/#menu",
    "inLanguage": "en",
    "isPartOf": { "@id": "https://www.kosportscafe.com/#restaurant" },
    "hasMenuSection": Object.entries(grouped).map(([category, sectionItems]) => ({
      "@type": "MenuSection",
      "name": category,
      "description": `${category} available at KOS Sports Café`,
      "hasMenuItem": sectionItems.map(item => ({
        "@type": "MenuItem",
        "name": item.name,
        "description": item.description || `${item.name} — a ${category} item at KOS Sports Café`,
        "url": "https://www.kosportscafe.com/#menu",
        ...(item.image_url ? { "image": item.image_url } : {}),
        ...(item.isVeg !== false ? { "suitableForDiet": ["https://schema.org/VegetarianDiet"] } : {}),
        "offers": buildOffers(item)
      }))
    }))
  };
};
