'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { ArchiveBoxIcon, HomeIcon, UserIcon } from '@heroicons/react/20/solid';

type SubMenu = {
  page: string;
  text: string;
  icon: any;
};

const subMenu: Array<SubMenu> = [
  {
    page: '/',
    text: 'Home',
    icon: <HomeIcon height={18} className='stroke-black' />,
  },
  {
    page: '/auth/admin/gestisci',
    text: 'Prodotti',
    icon: <ArchiveBoxIcon height={18} className='stroke-black' />,
  },
  {
    page: '/auth/admin',
    text: 'Profilo',
    icon: <UserIcon height={18} className='stroke-black' />,
  },
];

function SubHeader() {
  const pathname = usePathname();
  const [loggedUser, setLoggedUser] = useState<User>();
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user?.email) {
      setLoggedUser(user);
    } else {
      setLoggedUser(undefined);
    }
  });
  return (
    <div>
      <ul className='flex max-w-[200px] xs:max-w-sm mx-auto items-center justify-center gap-3 xs:gap-4'>
        {subMenu.map(
          (menu, index) =>
            (loggedUser || menu.text !== 'Prodotti') && (
              <div
                key={index}
                className='w-full mx-auto xs:col-span-1 flex flex-col gap-2'
              >
                <li className='flex flex-col items-center'>
                  <a
                    href={menu.page}
                    className={`flex items-center gap-1 p-2 xs:px-4 mt-4 w-max xs:w-full justify-center rounded-full ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-gray-400 ${
                      pathname === menu.page ? 'bg-gray-400' : null
                    }`}
                  >
                    {menu.icon}
                    <span className='hidden xs:flex'>{menu.text}</span>
                  </a>
                </li>
                <p className='flex xs:hidden text-xs text-center justify-center'>
                  {menu.text}
                </p>
              </div>
            )
        )}
      </ul>
    </div>
  );
}

export default SubHeader;
