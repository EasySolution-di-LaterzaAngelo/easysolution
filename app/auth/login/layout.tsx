import styles from '../../(main)/Main.module.css';
import Header from './Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`flex flex-col ${styles.main}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
