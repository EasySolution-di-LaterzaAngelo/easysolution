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

export const EasySolutionLogo = ({ setIsMenuOpen }: { setIsMenuOpen: any }) => {
  return (
    <Link title='Home' passHref href='/' onClick={setIsMenuOpen}>
      <Image
        alt='EasySolution Logo'
        src='/easysolutionlogo.jpeg'
        width={200}
        height={100}
        className='object-contain cursor-pointer '
        unoptimized={true}
      />
    </Link>
  );
};

export const TopNavMenu = ({ setIsMenuOpen }: { setIsMenuOpen: any }) => {
  return (
    <div className='h-24 mx-3'>
      <div className='flex justify-center content-start mt-2'>
        <EasySolutionLogo setIsMenuOpen={setIsMenuOpen} />
      </div>
      <button
        onClick={setIsMenuOpen}
        className={`absolute right-6 top-7 ${styles.hamburger}`}
      >
        <XMarkIcon height={24} className='stroke-black' />
      </button>
    </div>
  );
};

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const NavMenu = () => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return (
      <>
        {isMenuOpen && (
          <div
            key={'menu'}
            className='top-0 right-0 fixed h-screen w-full bg-[#F9F9F9] z-50'
          >
            <nav className='m-3 text-black'>
              <TopNavMenu setIsMenuOpen={() => setIsMenuOpen(false)} />

              <div
                key={`submenu`}
                className={`absolute top-24 left-0 right-0 bottom-0 overflow-auto overscroll-contain p-6 text-left bg-white z-50 rounded-t-xl rounded-b-md cursor-default shadow-[0_4px_24px_15px_rgba(32,33,36,.05)]`}
              >
                {/* List for the Sub Menu */}
                <h1 className='text-xl font-semibold'>I nostri servizi</h1>
                <ul className='divide-y flex flex-col'>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Cartoleria
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Idea Regalo
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Articoli per feste
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Incisioni su accaio e legno
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Prodotti di elettronica
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Bomboniere artigianali
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Articolari da personalizzare
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
                  <li
                    className='text-sm px-4 py-2 hover:bg-gray-100 hover:rounded-lg'
                    onClick={void 0}
                  >
                    <Link
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      title={`Test`}
                      passHref
                      href={`/`}
                      className='flex justify-between items-center'
                    >
                      Riparazioni smartphone / PC / Bimby / Folletto
                      <ChevronRightIcon
                        height={24}
                        className='stroke-blue-500 justify-item-end'
                      />
                    </Link>
                  </li>
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
      <button
        className={`flex items-center ${styles.hamburger}`}
        onClick={() => setIsMenuOpen(true)}
      >
        <Bars3Icon height={24} className='stroke-black' />
      </button>
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

export default Menu;
