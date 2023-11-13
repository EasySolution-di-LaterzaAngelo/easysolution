'use client';
import React, { useState } from 'react';
import styles from './Loading.module.css';

function MyLoading() {
  const [isLoading, setIsLoading] = useState(0);

  setTimeout(() => {
    setIsLoading(0);
  }, 500);
  return (
    <>
      <div className={styles.loader}>
        <div className={styles.loader__circle}></div>
        <div className={styles.loader__circle}></div>
        <div className={styles.loader__circle}></div>
        <div className={styles.loader__circle}></div>
      </div>
    </>
  );
}

export default MyLoading;
