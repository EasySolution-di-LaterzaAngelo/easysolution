import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://easysolutiontaranto.com/',
      lastModified: '2023-04-12',
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
