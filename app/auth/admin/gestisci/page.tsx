'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getProducts } from '@/pages/api/auth/getProducts';
import { Prodotto } from '@/types';
import Prodotti from './(prodotti)/Prodotti';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import {
  clear,
  selectSearchValue,
  update,
} from '../../../../slices/searchSlice';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/outline';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

function Gestisci() {
  const [prodotti, setProdotti] = useState<Prodotto[]>();
  const [categories, setCategories] = useState<any>();
  const [loggedUser, setLoggedUser] = useState<User>();

  useEffect(() => {
    async function fetchData() {
      const prodottiData = await getProducts();
      setProdotti(prodottiData);

      const categoriesArray: any[] = [];

      for (const product of prodottiData) {
        if (!categoriesArray.includes(product.categoria)) {
          categoriesArray.push(product.categoria);
        }
      }

      setCategories(categoriesArray);
    }

    onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setLoggedUser(user);
      } else {
        setLoggedUser(undefined);
      }
    });

    if (loggedUser !== undefined) {
      if (loggedUser?.uid !== process.env.NEXT_PUBLIC_UID) {
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      } else {
        fetchData();
      }
    }
  }, [loggedUser]);

  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const inputValue = useSelector(selectSearchValue);
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = input.replace(/\s+/g, ' ').trim();
    dispatch(update(trimmedValue));
    setInput('');
    if (inputRef.current) {
      inputRef.current.blur(); // Hide the keyboard
    }
  };

  const handleChange = (e: {
    target: { value: React.SetStateAction<string>; name: string };
  }) => {
    if (e.target.name === 'search') {
      setInput(e.target.value);
    } else if (e.target.name === 'Categoria') {
      dispatch(update(e.target.value.toString()));
      setInput('');
    }
  };

  const handleClearSearch = () => {
    dispatch(clear()); // Clear the search value
    if (typeof window !== 'undefined') {
      localStorage.setItem('inputValue', '');
    }
    const selectElement = document.getElementById(
      'grouped-native-select'
    ) as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = ''; // Reset select element to its first option
      handleChange({ target: { value: '', name: 'Categoria' } }); // Update state or Redux store accordingly
    }
  };

  return (
    <div className='relative my-10 xxs:my-auto m-auto flex flex-col gap-4 px-6'>
      <form
        onSubmit={handleSubmit}
        className='mb-2 mx-auto w-full gap-8 flex flex-col sm:flex-row'
      >
        <input
          ref={inputRef}
          type='text'
          name='search'
          placeholder='Cerca prodotto...'
          className='flex bg-gray-200 py-2 px-4 drop-shadow-lg w-full rounded-lg ring-2 ring-green-300 ring-offset-4 ring-offset-slate-50 focus:ring-0 focus:outline-green-500 placeholder:italic border-0'
          value={input}
          onChange={handleChange}
        />
        <div className='relative flex flex-row w-full md:w-1/2 items-center justify-center'>
          <label
            htmlFor='Categoria'
            className='absolute z-50 -top-2 inline-block bg-gray-50 px-1 text-xs font-medium text-gray-900'
          >
            Filtra Prodotti
          </label>
          <select
            defaultValue=''
            id='grouped-native-select'
            name='Categoria'
            onChange={handleChange}
            autoComplete='country-name'
            className='relative block w-full rounded-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          >
            <option aria-label='None' value='' />
            {categories?.map((category: any) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </form>
      {inputValue && (
        <div className=' w-full flex justify-center'>
          <h1
            onClick={handleClearSearch}
            className='flex items-center pl-4 pr-2 p-1 md:p-2 gap-1 rounded-full bg-zinc-300 border border-gray-400 font-medium text-sm md:text-xl cursor-pointer'
          >
            {inputValue}
            <XMarkIcon height={24} />
          </h1>
        </div>
      )}
      <div className='relative w-full flex flex-col'>
        <Prodotti prodotti={prodotti} />
      </div>

      <div className='flex flex-col items-center gap-2'>
        <a
          href='/auth/admin/gestisci/aggiungi'
          className='flex mx-auto p-4 items-center drop-shadow-lg text-white bg-green-400 rounded-full ring-2 ring-green-500 shadow-lg hover:ring-2 hover:ring-green-700 hover:bg-green-500'
        >
          <PlusIcon height={18} className='stroke-white' />
        </a>
        <p className='font-light'>Aggiungi prodotto</p>
      </div>
    </div>
  );
}

export default Gestisci;
