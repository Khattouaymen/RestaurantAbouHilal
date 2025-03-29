import React from 'react';

interface RestaurantStructuredDataProps {
  name: string;
  description: string;
  image: string;
  url: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  telephone: string;
  priceRange: string;
  servesCuisine: string[];
  openingHours: string[];
}

export function RestaurantStructuredData({
  name,
  description,
  image,
  url,
  address,
  geo,
  telephone,
  priceRange,
  servesCuisine,
  openingHours
}: RestaurantStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name,
    description,
    image,
    url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude
    },
    telephone,
    priceRange,
    servesCuisine,
    openingHoursSpecification: openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1].split('-')[0],
      closes: hours.split(' ')[1].split('-')[1]
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface MenuItemStructuredDataProps {
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
}

export function MenuItemStructuredData({ name, description, image, price, category }: MenuItemStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name,
    description,
    image,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'MAD'
    },
    category
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface MenuStructuredDataProps {
  name: string;
  description: string;
  url: string;
  hasMenuSection: Array<{
    name: string;
    description?: string;
    hasMenuItem: Array<{
      name: string;
      description: string;
      price: string;
    }>;
  }>;
}

export function MenuStructuredData({ name, description, url, hasMenuSection }: MenuStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name,
    description,
    url,
    hasMenuSection: hasMenuSection.map(section => ({
      '@type': 'MenuSection',
      name: section.name,
      description: section.description,
      hasMenuItem: section.hasMenuItem.map(item => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'MAD'
        }
      }))
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}