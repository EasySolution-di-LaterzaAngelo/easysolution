import React from 'react';
import styles from './Product.module.css';
import { Prodotto } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

function Product({ products }: { products: Array<Prodotto> | undefined }) {
  return (
    <>
      {products?.map((product) => (
        <a
          className={`relative flex flex-col h-80 w-full xs:w-48 m-auto p-4 bg-white shadow-sm hover:shadow-2xl hover:cursor-pointer bg-clip-padding bg-opacity-70 border border-gray-200`}
          key={product.id}
          href={`/${product.id}`}
        >
          {product.usato && (
            <p className='absolute top-1 left-0 text-center w-full text-sm font-semibold text-[#f99417]'>
              USATO
            </p>
          )}
          {product.ricondizionato && (
            <p className='absolute top-1 left-0 text-center w-full text-sm font-semibold text-[#f99417]'>
              RICONDIZIONATO
            </p>
          )}
          <div className='flex justify-center'>
            <Image
              src={product.immagini[0]}
              alt=''
              className={`aspect-auto object-cover h-40 xs:h-36 w-auto cursor-pointer rounded-md`}
              width={128}
              height={80}
              unoptimized={true}
            />
          </div>

          <div className='mt-1'>
            <p
              className={`font-light leading-normal text-[8px] xs:text-[10px] text-black text-center uppercase`}
              title={product.categoria}
            >
              {product.categoria}
            </p>
          </div>

          <div className='mt-2'>
            <p
              className={`font-normal leading-normal text-sm line-clamp-3 text-center`}
              title={product.nome}
            >
              {product.nome}
            </p>
          </div>
          <div
            className={`${styles.card_footer} flex bottom-0 inset-x-0 absolute px-4 h-14 w-full`}
          >
            {product.sconto !== undefined ? (
              <div className='flex flex-row gap-2 items-center py-2'>
                <div className='flex flex-row items-center gap-2'>
                  <span className='text-lg font-semibold'>
                    €{product.sconto}
                  </span>
                  <span className='text-xs text-gray-500 line-through'>
                    €{product.prezzo}
                  </span>
                </div>

                <p className='text-xl font-bold text-[#f99417]'>
                  -
                  {Math.round(
                    ((Number(product.prezzo.replace(',', '.')) -
                      Number(product.sconto.replace(',', '.'))) /
                      Number(product.prezzo.replace(',', '.'))) *
                      100
                  )}
                  %
                </p>
              </div>
            ) : product.percentuale !== undefined ? (
              <div className='flex flex-row gap-2 items-center py-2'>
                <div className='flex flex-col xs:flex-row xs:items-center xs:gap-2'>
                  <span className='tex-sm font-semibold'>
                    €
                    {Math.round(
                      Number(product.prezzo.replace(',', '.')) -
                        (Number(product.prezzo.replace(',', '.')) *
                          Number(product.percentuale.replace(',', '.'))) /
                          100
                    )}
                  </span>
                  <span className='text-sm text-gray-500 line-through'>
                    €{product.prezzo}
                  </span>
                </div>
                <p className='text-xl font-bold text-[#f99417]'>
                  -{product.percentuale}%
                </p>
              </div>
            ) : (
              <span className='font-bold'>€{product.prezzo}</span>
            )}

            <div className={`${styles.card_button} hidden`}>
              <svg className={styles.svg_icon} viewBox='0 0 20 20'>
                <path d='M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z'></path>
                <path d='M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z'></path>
                <path d='M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z'></path>
              </svg>
            </div>
          </div>
        </a>
      ))}
    </>
  );
}

export default Product;
