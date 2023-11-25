'use client';
import {
  BuildingStorefrontIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface GoogleData {
  result?: {
    opening_hours: {
      weekday_text: string[];
    };
    international_phone_number: string;
    url: string;
  };
}

export default function Footer({ googleData }: { googleData: GoogleData }) {
  const pathname = usePathname();
  return (
    <div className='relative w-screen'>
      <div
        className={`flex z-10 mt-5 ${
          pathname === '/prodotti'
            ? 'text-gray-300 bg-black/30'
            : ' text-gray-800 bg-slate-400/30'
        }  backdrop-blur-md  rounded-t-2xl`}
      >
        <div className='flex flex-col-reverse md:grid md:grid-cols-6 w-full p-4 justify-center items-center gap-8 md:gap-0'>
          <div className='flex flex-col lg:flex-row md:col-span-4 gap-2 items-center justify-center '>
            <div className='flex flex-col  w-72 gap-1'>
              <a
                href='mailto:
                easysolution2021@hotmail.com'
                className={`flex items-center gap-3 hover:underline hover:text-[#F6753D] `}
              >
                <EnvelopeIcon className='h-5' />
                <p>easysolution2021@hotmail.com</p>
              </a>
              <a
                href={`tel:${googleData?.result?.international_phone_number}`}
                className={`flex items-center gap-3 hover:underline hover:text-[#F6753D] `}
              >
                <PhoneIcon className='h-5' />
                <p>{googleData?.result?.international_phone_number}</p>
              </a>
              <a
                href={`${googleData?.result?.url}`}
                className={`flex items-center gap-3 hover:underline hover:text-[#F6753D] `}
              >
                <BuildingStorefrontIcon className='h-5' />
                <p>Via Cesare Battisti 115 - Taranto</p>
              </a>
            </div>
            <div className='flex w-72 items-start gap-3'>
              <ClockIcon className='h-5' />
              <div className='flex flex-col text-sm capitalize'>
                {googleData?.result?.opening_hours.weekday_text.map(
                  (
                    day:
                      | string
                      | number
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | React.ReactFragment
                      | React.ReactPortal
                      | null
                      | undefined,
                    index: React.Key | null | undefined
                  ) => (
                    <p key={index}>{day}</p>
                  )
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center justify-center w-52'>
            <div className='flex justify-center items-center gap-4'>
              <a
                href={'/'}
                className={`hover:underline hover:text-[#F6753D] ${
                  pathname === '/' ? 'hidden' : 'flex'
                }`}
              >
                Home
              </a>
            </div>
            <div className='flex flex-col w-full items-center justify-center gap-4'>
              <a
                href='https://www.facebook.com/hanamiwithlove'
                className={`flex items-center gap-2 hover:underline hover:text-[#F6753D] cursor-pointer`}
              >
                <Image
                  src={'/facebook.png'}
                  title='Facebook'
                  alt='Facebook'
                  className={`h-8 w-auto aspect-auto object-contain cursor-pointer`}
                  width={512}
                  height={512}
                  loading='eager'
                  priority={true}
                />
                <p className='shrink-0'>
                  Easy Solution
                  <br /> Di Laterza Angelo{' '}
                </p>
              </a>
              {/* <a
                href='https://www.instagram.com/easy_solution_taranto'
                className={`flex items-center gap-2 hover:underline hover:text-[#F6753D] cursor-pointer`}
              >
                <Image
                  src={'/instagram.png'}
                  title='Instagram'
                  alt='Instagram'
                  className={`h-8 w-auto aspect-auto object-contain cursor-pointer`}
                  width={512}
                  height={512}
                  loading='eager'
                  priority={true}
                />
                <p>@easy_solution_taranto</p>
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
