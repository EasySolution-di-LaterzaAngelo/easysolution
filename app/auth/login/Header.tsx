'use client';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import '../../(main)/globals.css';

const EasySolutionLogo = () => {
  return (
    <div className='flex w-full justify-center items-center sm:flex-grow-0 mx-auto'>
      <Link title='Home' passHref href='/' className='flex'>
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

function Header() {
  return (
    <header className='z-50 fixed w-full'>
      <div className='flex items-center p-4 lg:pt-6 bg-[#F9F9F9] shadow-lg z-50'>
        <EasySolutionLogo />
      </div>
    </header>
  );
}

export default Header;
