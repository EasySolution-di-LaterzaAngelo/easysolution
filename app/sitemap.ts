import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://easysolution.vercel.app/',
      lastModified: '2023-04-12',
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
