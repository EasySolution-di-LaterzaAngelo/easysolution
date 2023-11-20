import MyLoading from '@/app/(main)/MyLoading';
import { getProduct } from '@/pages/api/auth/getProducts';
import React from 'react';

import Product from './Product';
import { notFound } from 'next/navigation';

async function ProductPage({ params }: any) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className='flex flex-grow'>
      {product ? (
        <Product product={product} />
      ) : (
        <>
          <div className='bg-white flex justify-center items-center flex-grow z-0'>
            <MyLoading />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductPage;
