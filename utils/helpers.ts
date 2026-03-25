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
