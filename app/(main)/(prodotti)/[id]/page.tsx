'use client';
import MyLoading from '@/app/(main)/MyLoading';
import React, { useState, useEffect } from 'react';

import Product from './Product';
import { notFound } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectProductsValue } from '@/slices/setProductsSlice';
import { Prodotto } from '@/types';

function ProductPage({ params }: any) {
  const products = useSelector(selectProductsValue);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products) {
      const foundProduct = products.find(
        (product: Prodotto) => product.id === params.id
      ); // Assuming ID is present in params
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        notFound(); // Handle product not found scenario
      }
      setLoading(false);
    }
  }, [params.id, products]);
  return (
    <div className='flex flex-grow'>
      {loading ? (
        <div className='bg-white flex justify-center items-center flex-grow z-0'>
          <MyLoading />
        </div>
      ) : (
        <Product product={product} />
      )}
    </div>
  );
}

export default ProductPage;
