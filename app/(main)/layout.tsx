import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import ProvidersWrapper from './ProvidersWrapper';
import styles from './Main.module.css';
import Header from './(header)/Header';
import Footer from './(footer)/Footer';
import getGoogleData from './getGoogleData';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data: object = await getGoogleData();

  return (
    <html lang='en'>
      <Head>
        <title>Easy Solution</title>
        <meta name='description' content='e-commerce' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body className={`flex flex-col ${styles.main}`}>
        <ProvidersWrapper>
          <Header />
          {children}
          <Footer googleData={data} />
        </ProvidersWrapper>
        <Analytics />
      </body>
    </html>
  );
}
