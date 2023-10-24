'use client';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { update } from '@/slices/searchSlice';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import styles from './Header.module.css';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Menu from './Menu';

const SubHeader = () => {
  return (
    <div className='flex text-slate-900 gap-8 font-bold text-sm text-center'>
      <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
        Cartoleria
      </p>
      <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
        Idea Regalo
      </p>
      <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
        Articoli per feste
      </p>
      <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
        Incisioni su accaio e legno
      </p>
      <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
        Prodotti di elettronica
      </p>
      <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
        Bomboniere artigianali
      </p>
      <Disclosure>
        <Disclosure.Button className='flex gap-2 decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
          Altro
          <ChevronDownIcon height={20} className='stroke-black' />
        </Disclosure.Button>
        <Disclosure.Panel className='absolute top-[120px] left-0 w-full bg-[#F9F9F9] text-slate-900 h-20 items-center flex gap-8 p-4 shadow-lg'>
          <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
            Articolari da personalizzare
          </p>
          <p className='decoration-2 hover:underline hover:underline-offset-8 hover:cursor-pointer'>
            Riparazioni smartphone / PC / Bimby / Folletto
          </p>
        </Disclosure.Panel>
      </Disclosure>
    </div>
  );
};

const EasySolutionLogo = () => {
  return (
    <div className='flex justify-center items-center sm:flex-grow-0 lg:fixed lg:top-8 lg:left-1/2 lg:-translate-x-[110px]'>
      {/* Traslare immagine su asse x della meta' della lunghezza della immagine*/}
      <Link title='Home' passHref href='/'>
        <Image
          alt='Easy Solution Logo'
          src='/easysolutionlogo.jpeg'
          width={220}
          height={100}
          className='w-[180px] lg:w-[220px] object-contain cursor-pointer'
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
    router.push('/prodotti');
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

const User = () => {
  return (
    <div className='flex w-10 h-10 justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded-full'>
      <UserIcon width={20} height={20} className='stroke-[2px]' />
    </div>
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
  return (
    <header className='z-50 fixed w-full'>
      <div className='grid grid-rows-2 grid-flow-col gap-2 items-center p-4 lg:pt-6 bg-[#F9F9F9] shadow-lg z-50'>
        <div className='flex rows-span-1 justify-between'>
          <Menu />
          <div className='hidden w-80 lg:flex'>
            <SearchBar />
          </div>
          <EasySolutionLogo />
          <div className='flex gap-4'>
            <User />
            <Cart />
          </div>
        </div>
        <div className='flex row-span-1 lg:hidden'>
          <SearchBar />
        </div>
        <div className='hidden lg:flex h-12 items-center'>
          <SubHeader />
        </div>
      </div>
    </header>
  );
}

export default Header;
