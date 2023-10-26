'use client';
import React from 'react';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
} from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { redirect } from 'next/navigation';
import '../../../../app/(main)/globals.css';
import Image from 'next/image';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/firebase';

function SignInButton() {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>();

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  const signIn = () => {
    signInWithPopup(auth, provider).catch((error: { code: any }) => {
      // Handle Errors here.
      const errorCode = error.code;
      console.log(errorCode);
    });
  };

  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className='flex items-center justify-center p-2 gap-2 shadow-md border border-[#888] rounded w-full  cursor-pointer text-black hover:bg-gray-100'
              onClick={() => signIn()}
            >
              <Image
                src='/google.svg'
                alt='Google icon'
                className='h-6 w-6'
                width={64}
                height={64}
                unoptimized={true}
              />
              <p className='text-sm'>Accedi con {provider.name}</p>
            </button>
          </div>
        ))}
    </>
  );
}

export default SignInButton;
