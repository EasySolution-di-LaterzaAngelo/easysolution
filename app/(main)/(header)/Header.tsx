'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { update } from '@/slices/searchSlice';
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
import { getProducts } from '@/pages/api/auth/getProducts';

const SubHeader = ({ categories }: { categories: any }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const setInputFromMenu = (input: string) => {
    const trimmedValue = input.replace(/\s+/g, ' ').trim();
    dispatch(update(trimmedValue));
    router.push('/');
  };

  return (
    <div className='flex w-full text-slate-900 gap-8 font-bold text-sm text-center items-center '>
      <div className='flex w-full items-center justify-start gap-8'>
        {categories?.map((category: string) => (
          <p
            key={category}
            onClick={() => setInputFromMenu(`${category}`)}
            className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'
          >
            {category}
          </p>
        ))}
      </div>

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
          <Menu.Items className='absolute -right-4 top-10 flex gap-10 h-12 px-4 w-screen bg-[#F9F9F9] shadow-lg focus:outline-none items-center'>
            <Menu.Item>
              <p
                onClick={() =>
                  setInputFromMenu(
                    'Riparazioni smartphone / PC / Bimby / Folletto'
                  )
                }
                className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'
              >
                Riparazioni smartphone / PC / Bimby / Folletto
              </p>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

const EasySolutionLogo = () => {
  return (
    <div className='flex justify-center items-center sm:flex-grow-0 lg:fixed lg:top-2 lg:left-1/2 lg:-translate-x-[110px]'>
      {/* Traslare immagine su asse x della meta' della lunghezza della immagine*/}
      <Link title='Home' passHref href='/'>
        <Image
          alt='Easy Solution Logo'
          src='/easysolutionlogo.jpeg'
          width={260}
          height={100}
          className='w-[180px] lg:w-[260px] object-contain cursor-pointer'
          unoptimized={true}
        />
      </Link>
    </div>
  );
};

const SearchBar = () => {
  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = input.replace(/\s+/g, ' ').trim();
    dispatch(update(trimmedValue));
    setInput('');
    router.push('/');
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

function Header() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const prodottiData = await getProducts();

      const categoriesArray: any[] = [];

      for (const product of prodottiData) {
        if (!categoriesArray.includes(product.categoria)) {
          categoriesArray.push(product.categoria);
        }
      }

      setCategories(categoriesArray);
    }

    fetchData();
  }, []);
  return (
    <header className='z-50 fixed w-full'>
      <div className='grid grid-rows-2 grid-flow-col gap-2 items-center p-4 lg:pt-6 bg-[#F9F9F9] shadow-lg z-50'>
        <div className='flex rows-span-1 justify-between'>
          <Sidebar categories={categories} />
          <div className='hidden w-80 lg:flex'>
            <SearchBar />
          </div>
          <EasySolutionLogo />
          <div className='z-20 flex gap-4 items-center'>
            <Link
              href={'/'}
              className={` ${
                pathname === '/'
                  ? 'hidden'
                  : 'relative flex h-10 w-10 justify-center items-center md:gap-[2px] md:top-0 md:left-0 cursor-pointer hover:bg-slate-200 hover:rounded-full'
              } ${styles.home}`}
            >
              <HomeIcon height={24} />
            </Link>
            <User />
            {/* <Cart /> */}
          </div>
        </div>
        <div className='flex row-span-1 lg:hidden'>
          <SearchBar />
        </div>
        <div className='hidden lg:flex h-12 items-center w-full'>
          <SubHeader categories={categories} />
        </div>
      </div>
    </header>
  );
}

export default Header;
