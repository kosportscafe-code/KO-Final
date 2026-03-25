/**
 * Converts a Google Drive share link to a direct embed link.
 * Logic: Extracts ID and formats as uc?export=view&id=...
 */
export const getDriveImage = (url: string | undefined): string => {
  if (!url) return '';
  
  // If it's already a direct link or placeholder
  if (url.startsWith('http') && !url.includes('drive.google.com')) return url;
  if (url.startsWith('data:')) return url;

  // Regex to extract ID from standard drive share links
  const match = url.match(/[-\w]{25,}/);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[0]}`;
  }
  
  return url;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
/**
 * Generates SEO-friendly alt text for images.
 * If given a Cloudinary URL, it tries to extract keywords from the public ID.
 * Otherwise, it uses the provided title and category.
 */
export const generateAltText = (url: string | undefined, title: string, category?: string): string => {
  const base = "KOS Sports Café Meerut";
  const cleanTitle = title.trim();
  
  if (!url) return `${cleanTitle} - ${base}`;

  // Try to extract keywords from Cloudinary URL public_id
  // Example: .../v12345/category/item_name.jpg
  try {
    if (url.includes('cloudinary.com')) {
      const parts = url.split('/');
      const fileName = parts[parts.length - 1].split('.')[0];
      const keywords = fileName.replace(/[_-]/g, ' ');
      
      if (keywords.toLowerCase().includes(cleanTitle.toLowerCase())) {
        return `${keywords.charAt(0).toUpperCase() + keywords.slice(1)} at ${base}`;
      }
      return `${cleanTitle} (${keywords}) at ${base}${category ? ` - ${category}` : ''}`;
    }
  } catch (e) {
    // Fallback to title/category
  }

  return `${cleanTitle}${category ? ` (${category})` : ''} at ${base}`;
};

/**
 * Parses a date string like "25th March 2026" or "25/03/2026" and time "7:00 PM"
 * into an ISO 8601-like string for Schema.org.
 */
export const formatEventDate = (dateStr: string, timeStr: string): string => {
  try {
    const cleanDate = dateStr.replace(/(st|nd|rd|th)/gi, '');
    const dateObj = new Date(`${cleanDate} ${timeStr}`);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString();
  } catch (e) {
    return '';
  }
};

/**
 * Generates JSON-LD for an individual event.
 */
export const generateEventSchema = (show: { title: string; date: string; time: string; price: number; description: string; image: string }) => {
  const startDate = formatEventDate(show.date, show.time);
  
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": show.title,
    "description": show.description,
    "startDate": startDate || undefined,
    "image": [show.image],
    "location": {
      "@type": "Place",
      "name": "KOS Sports Café",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Near Rohta Road, NH58",
        "addressLocality": "Meerut",
        "addressRegion": "UP",
        "postalCode": "250002",
        "addressCountry": "IN"
      }
    },
    "offers": {
      "@type": "Offer",
      "url": `https://wa.me/917060403965?text=${encodeURIComponent(`Hello, I would like to book seats for ${show.title}`)}`,
      "price": show.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    },
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
  };
};

/**
 * Appends Cloudinary transformations for performance.
 * f_auto: automatic format (WebP/AVIF)
 * q_auto: automatic quality
 * w_{width}: specific width
 */
export const getOptimizedImageUrl = (url: string | undefined, width?: number): string => {
  if (!url) return '';
  
  // Handle local images (images/...)
  if (url.startsWith('/images/') || url.startsWith('images/')) {
    return url;
  }

  if (!url.includes('cloudinary.com')) return url;
  
  const transformations = `f_auto,q_auto${width ? `,w_${width},c_limit` : ''}`;

  try {
    if (url.includes('/upload/')) {
      const [base, rest] = url.split('/upload/');
      // Check if there are already transformations (e.g., /upload/c_fill,w_500/v123...)
      // Standard Cloudinary URL structure after /upload/:
      // 1. [transformations]/v[version]/[public_id]
      // 2. v[version]/[public_id]
      
      if (rest.startsWith('v') && /v\d+/.test(rest.split('/')[0])) {
        // Case 2: No transformations yet
        return `${base}/upload/${transformations}/${rest}`;
      } else {
        // Case 1: Already has transformations. We prepend ours or replace.
        // For simplicity and safety, we'll replace everything before the version 'v'
        const parts = rest.split('/');
        const versionIndex = parts.findIndex(p => p.startsWith('v') && /v\d+/.test(p));
        
        if (versionIndex !== -1) {
          const publicIdAndVersion = parts.slice(versionIndex).join('/');
          return `${base}/upload/${transformations}/${publicIdAndVersion}`;
        }
      }
    }
  } catch (e) {
    return url;
  }
  
  return url;
};
