import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import ProvidersWrapper from './ProvidersWrapper';
import styles from './Main.module.css';
import Header from './(header)/Header';
import Footer from './(footer)/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <Footer />
        </ProvidersWrapper>
        <Analytics />
      </body>
    </html>
  );
}
