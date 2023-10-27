'use client';
import { auth } from '@/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import React, { useEffect } from 'react';

function Producs() {
  useEffect(() => {
    async function fetchData() {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          signInAnonymously(auth);
        }
        if (user) {
          // if (inputValue !== '') {
          //   const productsFilterData = await getFilterProducts(inputValue);
          //   setProducts(productsFilterData);
          // } else {
          //   const productsData = await getProducts();
          //   setProducts(productsData);
          // }
        }
      });
    }
    fetchData();
  }, []);

  return <div></div>;
}

export default Producs;
