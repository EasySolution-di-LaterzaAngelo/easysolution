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
    text: '',
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
      <ul className='flex flex-row items-center justify-center gap-2'>
        {subMenu.map(
          (menu) =>
            (loggedUser || menu.text !== 'Prodotti') && (
              <li key={menu.text} className={`p-2`}>
                <a
                  href={menu.page}
                  className={`flex items-center gap-1 p-2 px-4 my-4 rounded-full ring-2 ring-gray-400 bg-gray-200 shadow-lg hover:ring-2 hover:ring-black hover:bg-gray-400 ${
                    pathname === menu.page ? 'bg-gray-400' : null
                  }`}
                >
                  {menu.icon}
                  {menu.text}
                </a>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default SubHeader;
