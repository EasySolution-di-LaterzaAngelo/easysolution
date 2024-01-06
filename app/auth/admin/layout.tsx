import React from 'react';
import SubHeader from './(adminHeader)/SubHeader';
import ProvidersWrapper from '@/app/(main)/ProvidersWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Easy Solution Di Laterza Angelo</title>
        <meta
          name='description'
          content='Esplorate la nostra cartoleria di oggetti artigianali unici. Bomboniere, incisioni su legno e metallo e molto altro, tutti creati a mano con passione.'
        />
        <link rel='canonical' href='https://easysolution.vercel.app/' />
        {/* IE */}
        <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
        {/* other browsers */}
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </head>
      <body className={`relative flex flex-col bg-slate-50 h-dvh`}>
        <ProvidersWrapper>
          <SubHeader />
          {children}
        </ProvidersWrapper>
      </body>
    </html>
  );
}
