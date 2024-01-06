import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://easysolutiontaranto.com/',
      lastModified: '2024-05-01',
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
