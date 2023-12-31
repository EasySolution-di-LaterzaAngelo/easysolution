'use client';
import { clear, selectSearchValue } from '@/slices/searchSlice';
import { Prodotto } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Product from './Product';
import Lottie from 'lottie-react';
import Product404 from '../../../public/Product404.json';
import MyLoading from '../MyLoading';
import { selectProductsValue } from '@/slices/setProductsSlice';
import { getFilterProducts } from './FilterProducts';

function Products() {
  const inputValue = useSelector(selectSearchValue);
  const dispatch = useDispatch();
  const products: Prodotto[] = useSelector(selectProductsValue);
  const [filteredProducts, setFilteredProducts] = useState<Prodotto[]>();

  useEffect(() => {
    if (products) {
      const foundDiscountedProducts = products.filter(
        (product: Prodotto) => product.sconto
      );
      if (foundDiscountedProducts.length > 0) {
        setFilteredProducts(foundDiscountedProducts);
      }
    }
    if (inputValue !== '') {
      const foundFilteredProducts = getFilterProducts(products, inputValue);
      setFilteredProducts(foundFilteredProducts);
    }
  }, [products, inputValue]);

  return (
    <>
      <div className="fixed hidden sm:flex bg-[url('/waves_bottom.svg')] bg-cover h-screen w-screen -z-10"></div>
      <div className="fixed flex sm:hidden bg-[url('/waves_bottom_vertical.svg')] bg-cover h-screen w-screen -z-10"></div>

      <div className='flex justify-center flex-grow z-10'>
        <div className='mx-auto px-4'>
          {filteredProducts ? (
            <>
              {inputValue === '' && (
                <h1 className='mt-[220px] lg:mt-[240px] text-center text-3xl font-bold text-slate-700'>
                  Le nostre Offerte
                </h1>
              )}
              {inputValue && (
                <div className='z-50 px-4 mt-[220px] lg:mt-[220px] w-full flex justify-center'>
                  <h1
                    onClick={() => {
                      dispatch(clear());
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('inputValue', '');
                      }
                    }}
                    className='flex items-center pl-4 pr-2 p-2 gap-1 rounded-full bg-zinc-300 border border-gray-400 font-medium text-xl cursor-pointer'
                  >
                    {inputValue}
                    <XMarkIcon height={24} />
                  </h1>
                </div>
              )}
              <div
                className={`grid  ${
                  products.length === 1 ? 'grid-cols-1' : ''
                } grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-4 sm:gap-x-6 sm:gap-y-6 mb-4 ${
                  inputValue ? 'mt-10' : 'mt-8 xs:mt-10'
                } ${products.length === 0 && 'mt-0'}`}
              >
                <Product products={filteredProducts} />
              </div>
              {products.length === 0 && inputValue && (
                <div className='flex flex-col justify-center items-center mx-10 -mt-20 -z-10'>
                  <Lottie
                    animationData={Product404}
                    className='flex w-full sm:w-1/2 lg:w-1/3 -z-10'
                  />
                  <p className='text-base font-mono font-light text-center md:mx-40 md:text-lg xl:mx-80'>
                    La ricerca del prodotto non è andata a buon fine in quanto
                    non è attualmente disponibile presso il nostro negozio. Ci
                    scusiamo per l&apos;inconveniente. Tuttavia, potrebbe
                    essersi verificato un errore nella digitazione del nome del
                    prodotto.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className='flex justify-center items-center h-screen'>
              <MyLoading />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Products;
