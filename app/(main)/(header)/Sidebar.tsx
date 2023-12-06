import { Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Header.module.css';
import {
  ArrowLeftIcon,
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { update } from '@/slices/searchSlice';

export const EasySolutionLogo = ({ setIsMenuOpen }: { setIsMenuOpen: any }) => {
  return (
    <a title='Home' href='/' onClick={setIsMenuOpen}>
      <Image
        alt='EasySolution Logo'
        src='/easysolutionlogo.jpeg'
        width={200}
        height={100}
        className='object-contain cursor-pointer '
        unoptimized={true}
      />
    </a>
  );
};

function Sidebar({ categories }: { categories: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const NavMenu = () => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const setInputFromMenu = (input: string) => {
      const trimmedValue = input.replace(/\s+/g, ' ').trim();
      dispatch(update(trimmedValue));
      if (typeof window !== 'undefined') {
        localStorage.setItem('inputValue', trimmedValue);
        window.location.replace('/');
      }
    };
    return (
      <>
        {isMenuOpen && (
          <div
            key={'menu'}
            className='top-[135px] right-0 fixed h-[calc(100vh-128px)] w-full bg-[#F9F9F9] z-50'
          >
            <nav className='text-black'>
              <div
                key={`submenu`}
                className={`absolute top-0 left-0 right-0 bottom-0 overflow-auto overscroll-contain p-6 text-left bg-white z-50 rounded-t-xl rounded-b-md cursor-default shadow-[0_4px_24px_15px_rgba(32,33,36,.05)]`}
              >
                {/* List for the Sub Menu */}
                <h1 className='text-xl font-semibold'>I nostri servizi</h1>
                <ul className='divide-y flex flex-col'>
                  {categories?.map((category: string) => (
                    <li
                      key={category}
                      className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg cursor-pointer'
                      onClick={() => {
                        setIsMenuOpen(false);
                        setInputFromMenu(`${category}`);
                      }}
                    >
                      <a
                        title={category}
                        href={`/`}
                        className='flex justify-between items-center'
                      >
                        {category}
                        <ChevronRightIcon
                          height={24}
                          className='stroke-blue-500 justify-item-end'
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        )}
      </>
    );
  };

  return (
    <div className='flex lg:hidden'>
      {!isMenuOpen ? (
        <button
          role='button'
          title='Menú'
          className={`flex items-center justify-center ${styles.hamburger} h-10 w-10 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-slate-200 hover:rounded-full`}
          onClick={() => setIsMenuOpen(true)}
        >
          <Bars3Icon height={24} className='stroke-black' />
        </button>
      ) : (
        <button
          role='button'
          title='Chiudi Menú'
          className={`flex items-center justify-center ${styles.hamburger} h-10 w-10 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-slate-200 hover:rounded-full`}
          onClick={() => setIsMenuOpen(false)}
        >
          <XMarkIcon height={24} className='stroke-black' />
        </button>
      )}

      <Transition
        show={isMenuOpen}
        enter='transition-opacity duration-[200ms]'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-[200ms]'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <NavMenu />
      </Transition>
    </div>
  );
}

export default Sidebar;
