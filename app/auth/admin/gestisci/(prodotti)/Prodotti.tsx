import { auth } from '@/firebase';
import { getFilterProducts, getProducts } from '@/pages/api/auth/getProducts';
import { selectSearchValue } from '@/slices/searchSlice';
import { Prodotto } from '@/types';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Gestisci.module.css';
import Lottie from 'lottie-react';
import Product404 from '../../../../../public/Product404.json';
import MyLoading from '@/app/(main)/MyLoading';

function Prodotti({ prodotti }: { prodotti: Array<Prodotto> | undefined }) {
  const inputValue = useSelector(selectSearchValue);
  const dispatch = useDispatch();

  const [products, setProducts] = useState<Prodotto[]>();

  const [loggedUser, setLoggedUser] = useState<User>();

  onAuthStateChanged(auth, (user) => {
    if (user?.email) {
      setLoggedUser(user);
    } else {
      setLoggedUser(undefined);
    }
  });

  useEffect(() => {
    setProducts(prodotti);
  }, [prodotti]);

  useEffect(() => {
    async function fetchData() {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          signInAnonymously(auth);
        }
        if (user) {
          if (inputValue !== '') {
            const productsFilterData = await getFilterProducts(inputValue);
            setProducts(productsFilterData);
          } else {
            if (
              loggedUser !== undefined &&
              loggedUser?.uid !== process.env.UID
            ) {
              const productsData = await getProducts();
              setProducts(productsData);
            }
          }
        }
      });
    }
    fetchData();
  }, [inputValue]);
  return (
    <>
      {products != undefined && products?.length > 0 ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-auto items-center justify-center bg-white h-[28rem] content-start max-w-4xl md:w-full md:h-2/3 rounded-3xl shadow-lg bg-clip-padding bg-opacity-60 border border-gray-200 overflow-y-scroll ${styles.card}`}
        >
          {products?.map((product) => (
            <div key={product.id} className='border-[1px]'>
              <Link
                href={`/auth/admin/gestisci/${product.id}`}
                className='flex flex-row items-center h-16 justify-between mx-6 my-4 hover:bg-gray-300 hover:rounded-xl hover:cursor-pointer'
              >
                <div className='h-16 w-16 bg-white rounded-xl shadow-lg shrink-0'>
                  <Image
                    src={product.immagini[0]}
                    alt='Prodotto'
                    className='h-16 p-2 aspect-auto object-contain bg-white rounded-xl '
                    width={64}
                    height={64}
                    unoptimized={true}
                  />
                </div>
                <div className='items-center'>
                  <p className='mx-2 line-clamp-2 justify-center text-center'>
                    {product.nome}
                  </p>
                </div>
                <div className='items-center shrink-0'>
                  <p className='shrink-0 italic font-bold text-xs'>
                    {product.prezzo} €
                  </p>
                  {product.sconto && (
                    <p className='shrink-0 italic font-light text-xs'>
                      {product.sconto} €
                    </p>
                  )}
                  {product.percentuale && (
                    <p className='shrink-0 italic font-light text-xs'>
                      - {product.percentuale} %
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : products != undefined ? (
        <div
          className={`flex m-auto items-center justify-center bg-white h-[28rem] content-start max-w-4xl md:w-full md:h-2/3 rounded-3xl shadow-lg bg-clip-padding bg-opacity-60 border border-gray-200 overflow-y-scroll ${styles.card}`}
        >
          <div className='flex flex-col justify-center items-center mx-10 -mt-20 py-10 px-5 z-10'>
            <Lottie
              animationData={Product404}
              className='flex w-full sm:w-1/2 lg:w-1/3 z-10'
            />
            <p className='text-base font-mono font-light text-center md:mx-40 md:text-lg'>
              La ricerca del prodotto non è andata a buon fine. Tuttavia,
              potrebbe essersi verificato un errore nella digitazione del nome
              del prodotto.
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`flex m-auto items-center justify-center bg-white h-96 w-80 md:w-96 content-start max-w-4xl rounded-3xl shadow-lg bg-clip-padding bg-opacity-60 border border-gray-200 overflow-y-scroll ${styles.card}`}
        >
          <MyLoading />
        </div>
      )}
    </>
  );
}

export default Prodotti;
