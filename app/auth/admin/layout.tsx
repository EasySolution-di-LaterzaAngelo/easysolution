import React from 'react';
import SubHeader from './(adminHeader)/SubHeader';
import ProvidersWrapper from '@/app/(main)/ProvidersWrapper';
import styles from './Admin.module.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`flex flex-col bg-slate-50 ${styles.main}`}>
        <ProvidersWrapper>
          <SubHeader />
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}
