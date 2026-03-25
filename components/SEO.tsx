import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "KOS Café | Where Sports Meet Taste", 
  description = "The ultimate gathering place for sports enthusiasts and food lovers in Meerut. Experience world-class gaming and world-class cuisine at KOS Sports Café.",
  image = "/images/Hero1.jpg",
  url = "https://www.kosportscafe.com",
  type = "website"
}) => {
  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Open Graph Tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image.startsWith('http') ? image : `${window.location.origin}${image}` },
      { property: 'og:url', content: url || window.location.href },
      { property: 'og:type', content: type }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // Update Twitter Tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image.startsWith('http') ? image : `${window.location.origin}${image}` }
    ];

    twitterTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

  }, [title, description, image, url, type]);

  return null; // This component doesn't render anything
};

export default SEO;
