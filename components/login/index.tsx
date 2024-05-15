'use client';

import React, {useEffect, useRef, useState} from 'react';

import {signInUserWithEmailAndPassword} from "@/utilities/firebaseClient";
import {useRouter} from "next/navigation";
import loaderService from "@/services/loader-service";

const Index = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const accessToken: string = localStorage.getItem('accessToken') ?? '';
    if (accessToken) {
      router.replace('/home');
    }
  }, [router]);

  const handleSubmitClick = async () => {
    error && setError('');

    try {
      const email: string = emailRef?.current?.value || '';
      const password: string = passwordRef?.current?.value || '';

      loaderService.showLoader(true);
      const response: any = await signInUserWithEmailAndPassword(email, password);

      if (!response?.user?.accessToken) {
        throw '';
      }

      localStorage.setItem('accessToken', response?.user?.accessToken);
      router.replace('/home');
    }
    catch (error) {
      setError('Incorrect credentials');
    }
    finally {
      loaderService.showLoader(false);
    }
  }

  return (
    <div
      className={'flex flex-col justify-center items-center w-full'}
      style={{
        maxHeight: 'calc(100vh - 8rem)',
        minHeight: 'calc(100vh - 8rem)'
      }}
    >
      <div className={'w-[95%] md:w-[50%] lg:w-[35%] p-6 rounded-[0.8rem] border border-solid flex flex-col gap-y-4'}>
        <div className={'text-center'}>
          <b className={'text-xl'}>Log In</b>
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <input
            className={'border border-solid border-gray-300 outline-none px-4 py-3 rounded-lg w-full mt-2'}
            placeholder={'Email'}
            ref={emailRef}
          />
          <input
            className={'border border-solid border-gray-300 outline-none px-4 py-3 rounded-lg w-full mt-2'}
            placeholder={'Password'}
            ref={passwordRef}
          />
        </div>
        <button
          className={'btn-primary bg-navyblue text-white rounded-md py-2.5 px-5 font-medium mt-3'}
          onClick={handleSubmitClick}
        >
          Submit
        </button>
      </div>
      <p
        style={{ color: 'red' }}
        className={'mt-3 text-lg'}
      >
        {error}
      </p>
    </div>
  );
};

export default Index;