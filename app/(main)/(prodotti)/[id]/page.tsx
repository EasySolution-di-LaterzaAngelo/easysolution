'use client';
import MyLoading from '@/app/(main)/MyLoading';
import React, { useState, useEffect } from 'react';
import Product from './Product';
import { notFound } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectProductsValue } from '@/slices/setProductsSlice';
import { Prodotto } from '@/types';
import { selectGoogleValue } from '@/slices/googleSlice';

function ProductPage({ params }: any) {
  const products = useSelector(selectProductsValue);
  const googleData = useSelector(selectGoogleValue);
  const [product, setProduct] = useState(null);
  const [google, setGoogle] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (googleData && products) {
      const foundProduct = products.find(
        (product: Prodotto) => product.id === params.id
      );
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        notFound();
      }
      setGoogle(googleData);
      setLoading(false);
    }
  }, [params.id, products, googleData]);

  return (
    <div className='flex flex-grow'>
      {loading ? (
        <div className='bg-white flex justify-center items-center flex-grow z-0'>
          <MyLoading />
        </div>
      ) : (
        <Product product={product} googleData={google} />
      )}
    </div>
  );
}

export default ProductPage;
