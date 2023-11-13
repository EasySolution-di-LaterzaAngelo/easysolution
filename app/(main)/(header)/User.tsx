import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  LockClosedIcon,
  TruckIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const FloatingMenu = ({ loggedUser }: { loggedUser: User | undefined }) => {
  const router = useRouter();
  return (
    <Menu.Items className='absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
      {/* {loggedUser && (
        <div className='px-1 py-1 '>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
              >
                <UserIcon
                  height={18}
                  className={`${active ? 'stroke-white' : 'stroke-black'}`}
                />
                Profilo
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
              >
                <TruckIcon
                  height={18}
                  className={`${active ? 'stroke-white' : 'stroke-black'}`}
                />
                I miei ordini
              </button>
            )}
          </Menu.Item>
        </div>
      )}
      <div className='px-1 py-1'>
        {!loggedUser ? (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                  onClick={() => router.push('/signup')}
                >
                  <UserPlusIcon
                    height={18}
                    className={`${active ? 'stroke-white' : 'stroke-black'}`}
                  />
                  Registrati
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                  onClick={() => router.push('/auth/login')}
                >
                  <ArrowLeftOnRectangleIcon
                    height={18}
                    className={`${active ? 'stroke-white' : 'stroke-black'}`}
                  />
                  Accedi
                </button>
              )}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                  onClick={() => signOut(auth)}
                >
                  <ArrowRightOnRectangleIcon
                    height={18}
                    className={`${active ? 'stroke-white' : 'stroke-black'}`}
                  />
                  Esci
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </div> */}
      <div className='px-1 py-1'>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-violet-500 text-white' : 'text-gray-900'
              } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
              onClick={() => router.push('/auth/admin')}
            >
              <LockClosedIcon
                height={18}
                className={`${active ? 'stroke-white' : 'stroke-black'}`}
              />
              Amministratore
            </button>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  );
};

function User() {
  const [loggedUser, setLoggedUser] = useState<User>();

  onAuthStateChanged(auth, (user) => {
    if (user?.email) {
      setLoggedUser(user);
    } else {
      setLoggedUser(undefined);
    }
  });
  return (
    <>
      <Menu as='div' className='relative isolate text-left'>
        <div>
          <Menu.Button className='inline-flex w-full justify-center items-center gap-2 rounded-md text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'>
            <div className='flex w-10 h-10 justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded-full'>
              <UserIcon
                width={20}
                height={20}
                className='stroke-[2px] stroke-black'
              />
            </div>
          </Menu.Button>
        </div>
        <Transition
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <div
            className={`absolute -top-14 -right-4 bottom-0 h-screen w-screen bg-gray-500 opacity-25`}
          />
          <FloatingMenu loggedUser={loggedUser} />
        </Transition>
      </Menu>
    </>
  );
}

export default User;
