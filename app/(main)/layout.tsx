import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import ProvidersWrapper from './ProvidersWrapper';
import styles from './Main.module.css';
import Header from './(header)/Header';
import Footer from './(footer)/Footer';
import getGoogleData from './getGoogleData';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '@/firebase';
import {
  getDiscountedProducts,
  getProducts,
} from '@/pages/api/auth/getProducts';
import { Prodotto } from '@/types';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data: object = await getGoogleData();
  const productsData: Prodotto[] = await getProducts();
  // onAuthStateChanged(auth, async (user) => {
  //   if (!user) {
  //     signInAnonymously(auth);
  //   }
  // });

  return (
    <html lang='it'>
      <head>
        <title>Easy Solution</title>
        <meta name='description' content='e-commerce' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={`flex flex-col ${styles.main}`}>
        <ProvidersWrapper>
          <Header productsData={productsData} />
          {children}
          <Footer googleData={data} />
        </ProvidersWrapper>
        <Analytics />
      </body>
    </html>
  );
}
