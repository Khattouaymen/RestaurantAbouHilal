import { useEffect } from "react";

interface SEOHelmetProps {
  title: string;
  description: string;
  pathname?: string;
  imageUrl?: string;
}

export default function SEOHelmet({
  title,
  description,
  pathname = "/",
  imageUrl = "/logo.svg"
}: SEOHelmetProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Restaurant ABOU Hilal`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update OpenGraph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", `https://abou-hilal.ma${pathname}`);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && imageUrl) {
      ogImage.setAttribute("content", `https://abou-hilal.ma${imageUrl}`);
    }

    // Update canonical link
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", `https://abou-hilal.ma${pathname}`);
    }
  }, [title, description, pathname, imageUrl]);

  return null; // This component doesn't render anything
}