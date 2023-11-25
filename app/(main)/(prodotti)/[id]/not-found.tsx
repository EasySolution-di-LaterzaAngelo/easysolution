'use client';
import Link from 'next/link';
import Lottie from 'lottie-react';
import Icon404 from '../../../../public/Icon404.json';

export default function NotFound() {
  return (
    <div className='h-screen flex justify-center items-center top-40 overflow-x-hidden'>
      <div className='w-[354px] h-[354px] relative p-8 bg-white shadow-lg rounded-3xl bg-clip-padding bg-opacity-60 border border-gray-200'>
        <div className='absolute top-0 -left-10 w-64 h-64 bg-[#F5965A] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob'></div>
        <div className='absolute top-0 -right-20 w-64 h-64 bg-[#2BE961] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-16 left-10 w-64 h-64 bg-[#27CFD6] rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000'></div>
        <div className='flex flex-col w-full h-full justify-around items-center z-10'>
          <div className='text-neutral-600 font-semibold italic text-3xl font-mono z-10'>
            <div className='flex flex-col items-center'>
              <Lottie animationData={Icon404} className='w-40' />
              <p>Errore</p>
            </div>
          </div>
          <p className='text-neutral-600 font-light not-italic text-lg font-mono text-center'>
            Ops! La pagina che stai cercando non esiste.
          </p>
          <a
            href={'/'}
            className='z-10 px-4 py-2 rounded-full bg-neutral-600 bg-opacity-25 border border-gray-800 cursor-pointer hover:bg-opacity-40 hover:ease-in-out hover:duration-300'
          >
            Torna a Easy Solution
          </a>
        </div>
      </div>
    </div>
  );
}
