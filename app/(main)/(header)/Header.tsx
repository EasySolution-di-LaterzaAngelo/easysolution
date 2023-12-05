'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { update, clear } from '@/slices/searchSlice';
import { selectProductsValue, updateProducts } from '@/slices/setProductsSlice';

import {
  HomeIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import styles from './Header.module.css';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Sidebar from './Sidebar';
import User from './User';
import { Prodotto } from '@/types';

const SubHeader = ({ categories }: { categories: string[] }) => {
  const dispatch = useDispatch();
  const setInputFromMenu = (input: string) => {
    const trimmedValue = input.replace(/\s+/g, ' ').trim();
    dispatch(update(trimmedValue));
    if (typeof window !== 'undefined') {
      localStorage.setItem('inputValue', trimmedValue);
    }
  };

  const MAX_DISPLAY_CATEGORIES = 5;

  // Split categories based on the maximum display limit
  const displayedCategories = categories?.slice(0, MAX_DISPLAY_CATEGORIES);
  const overflowCategories = categories?.slice(MAX_DISPLAY_CATEGORIES);

  return (
    <div className='flex w-full text-slate-900 gap-8 font-bold text-sm text-center items-center '>
      <div className='flex w-full items-center justify-start gap-8'>
        {displayedCategories?.map((category: string, index) => (
          <a
            key={index}
            href='/'
            onClick={() => setInputFromMenu(`${category}`)}
            className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'
          >
            {category}
          </a>
        ))}
      </div>
      {categories?.length > MAX_DISPLAY_CATEGORIES && (
        <Menu as='div' className='flex relative isolate z-0'>
          <Menu.Button className='inline-flex w-full justify-center items-center gap-2 rounded-md text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <div className='flex text-slate-900 font-bold text-sm text-center items-center justify-center decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
              Altro
              <ChevronDownIcon height={20} className='stroke-black' />
            </div>
          </Menu.Button>
          <Transition
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 -translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 -translate-y-1'
          >
            <Menu.Items className='absolute -right-4 top-8 flex gap-10 h-12 px-4 w-screen bg-[#F9F9F9] shadow-lg focus:outline-none items-center'>
              {overflowCategories?.map((category: string, index) => (
                <Menu.Item key={index}>
                  <p
                    onClick={() => setInputFromMenu(`${category}`)}
                    className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'
                  >
                    {category}
                  </p>
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </div>
  );
};

const EasySolutionLogo = () => {
  return (
    <div className='flex justify-center items-center sm:flex-grow-0 lg:fixed lg:top-2 lg:left-1/2 lg:-translate-x-[110px]'>
      {/* Traslare immagine su asse x della meta' della lunghezza della immagine*/}
      <a title='Home' href='/'>
        <Image
          alt='Easy Solution Logo'
          src='/easysolutionlogo.jpeg'
          width={260}
          height={100}
          className='w-[180px] lg:w-[260px] object-contain cursor-pointer'
          unoptimized={true}
        />
      </a>
    </div>
  );
};

const EasySolutionVideo = () => {
  return (
    <div className='fixed justify-center items-center w-[180px] h-[90px] sm:w-[240px] sm:h-[120px] shrink-0 top-2 left-1/2 -translate-x-[90px] sm:-translate-x-[120px]'>
      <a title='Home' href='/'>
        <div
          dangerouslySetInnerHTML={{
            __html: `<video className="app__backgroundVideo" height="300" width="240" poster="/poster.png" autoplay loop muted playsinline>
                      <source src="/easysolutionvideo.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>`,
          }}
        />
      </a>
    </div>
  );
};

const SearchBar = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = input.replace(/\s+/g, ' ').trim();
    dispatch(update(trimmedValue));
    if (typeof window !== 'undefined') {
      localStorage.setItem('inputValue', trimmedValue);
      window.location.replace('/');
    }
    setInput('');
    if (inputRef.current) {
      inputRef.current.blur(); // Hide the keyboard
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-grow lg:w-4/6 items-center text-xs rounded-full h-10 cursor-pointer shadow-md ${styles.searchbar}`}
    >
      <input
        ref={inputRef}
        className='p-2 h-full w-6 flex-grow flex-shrink rounded-l-full text-base focus:outline-none px-4 placeholder:italic placeholder:text-sm placeholder:text-slate-400 border-0 focus:ring-0'
        type='text'
        name='search'
        placeholder='Cosa stai cercando?'
        value={input}
        onChange={handleChange}
      />
      <button
        className='flex-none h-10 px-4 py-2 bg-white rounded-r-full'
        onClick={() => handleSubmit}
      >
        <MagnifyingGlassIcon width={20} height={20} className='stroke-[2px]' />
      </button>
    </form>
  );
};

const Cart = () => {
  return (
    <div className='flex w-10 h-10 justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded-full'>
      <ShoppingCartIcon width={20} height={20} className='stroke-[2px]' />
      <div className='absolute rounded-full top-4 lg:top-7 right-4 w-3 h-3 bg-yellow-500 text-xs justify-center'>
        <p className='h-full w-full text-[10px] text-center leading-[13px]'>
          0
        </p>
      </div>
    </div>
  );
};

function Header({ productsData }: { productsData: Prodotto[] }) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateProducts(productsData));

    const categoriesArray: any[] = [];

    for (const product of productsData) {
      if (!categoriesArray.includes(product.categoria)) {
        categoriesArray.push(product.categoria);
      }
    }

    setCategories(categoriesArray);
  }, [productsData]);

  return (
    <header className='z-50 fixed w-full'>
      <div className='grid grid-rows-3 grid-flow-col gap-5 lg:gap-0 items-center p-2 xxs:p-4 lg:pt-6 bg-[#F9F9F9] shadow-lg z-50'>
        <div className='flex h-24 row-span-2 justify-between'>
          <Sidebar categories={categories} />
          <div className='hidden w-80 lg:flex'>
            <SearchBar />
          </div>
          {/* <EasySolutionLogo /> */}
          <EasySolutionVideo />
          <div className='z-20 flex flex-col lg:flex-row gap-4 items-center lg:items-start'>
            <User />
            <a
              href={'/'}
              className={` ${
                pathname === '/'
                  ? 'hidden'
                  : 'relative flex h-10 w-10 justify-center items-center md:gap-[2px] md:top-0 md:left-0 cursor-pointer hover:bg-slate-200 hover:rounded-full lg:order-first'
              } ${styles.home}`}
            >
              <HomeIcon height={24} />
            </a>
            {/* <Cart /> */}
          </div>
        </div>
        <div className='flex row-span-1 lg:hidden'>
          <SearchBar />
        </div>
        <div className='hidden lg:flex items-end w-full'>
          <SubHeader categories={categories} />
        </div>
      </div>
    </header>
  );
}

export default Header;
