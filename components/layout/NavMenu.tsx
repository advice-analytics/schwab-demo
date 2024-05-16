import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { BsJustify } from "react-icons/bs";
import NextImage from 'next/image';
import Link from 'next/link';

import LogoImage from '@/public/commsai.png';

import HeaderNavLink from './HeaderNavLink';
import { BsXLg } from "react-icons/bs";
import {useRouter} from "next/navigation";

const NavMenu: React.FC<NavMenuProps> = ({ }) => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSupportPopUp, setSupportPopUp] = useState<boolean>(false);
  const [showMobileMenu, setMobileMenu] = useState<boolean>(false);

  const handleSupportItemClick = () => {
    setSupportPopUp(true);
  }

  let accessToken: string | null = null;

  if (typeof localStorage !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }

  const menuItems: { label: string; disabled?: boolean; onClick?: () => void }[] = [
    { label: `Plans`, onClick: () => router.push('/home'), disabled: !accessToken },
    { label: 'Profile', disabled: true },
    { label: 'Support', onClick: handleSupportItemClick }
  ];

  return (
    <Disclosure as='nav' className={`bg-black shadow h-[4rem]`}>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-8xl px-2 sm:px-4 lg:px-8'>
            <div className='flex h-16 justify-between'>
              <div className='flex px-2 lg:px-0 items-center'>
                <Link href="/home">
                  <NextImage
                    className='h-9 md:h-10 w-auto'
                    src={LogoImage}
                    alt=''
                    width={250}
                    height={250}
                  />
                </Link>
              </div>
              <div className={'flex items-center text-red-500 -ml-14 md:-ml-16 lg:ml-16'}>
                <b className={'text-lg'}>DEMO</b>
              </div>
              {/*<div className='flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end'></div>*/}
              <div className='flex px-2 lg:px-0'>
                <div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
                  {menuItems.map((item, index: number) => (
                    <div key={index} id={item.label} className={`flex items-center ${item.disabled ? 'disable' : ''}`}>
                      <p className={'text-navyblue text-sm cursor-pointer'} onClick={item.onClick}>
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className={'flex items-center lg:hidden'}>
                  <BsJustify fontSize={30} onClick={() => setMobileMenu(true)}/>
                </div>
              </div>
              {/*<div className='flex items-center lg:hidden'>*/}
              {/*  <Disclosure.Button className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:navyblue'>*/}
              {/*    <span className='absolute -inset-0.5' />*/}
              {/*    <span className='sr-only'>Open main menu</span>*/}
              {/*    {open ? (*/}
              {/*      <XMarkIcon className='block h-6 w-6' aria-hidden='true' />*/}
              {/*    ) : (*/}
              {/*      <Bars3Icon className='block h-6 w-6' aria-hidden='true' />*/}
              {/*    )}*/}
              {/*  </Disclosure.Button>*/}
              {/*</div>*/}
              {/*<div className='flex ml-4 lg:flex lg:items-center'></div>*/}
            </div>
          </div>

          {showSupportPopUp && (
            <div className={'fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-30 z-[100]'}>
              <div className={'bg-white w-[98%] md:w-[60%] p-7 rounded-[10px] text-base'}>
                <div className={'flex justify-end'}>
                  <BsXLg
                    className={'cursor-pointer'}
                    fontSize={20}
                    onClick={() => setSupportPopUp(false)}
                  />
                </div>
                <p className={'mt-2'}>
                  Questions? <span className={'underline text-navyblue'}>askme@adviceanalytics.com</span>
                </p>
                <p className={'mt-3'}>
                  Thank you for trying CommsAI – AI that scores plan
                  participants on their highest needs for advice.
                  Our Retirement to Wealth bridge offers API connectivity to
                  180+ AI ML / GenAI scoring algorithms & individual-level plan
                  data for advisors to offer wealth advice services and client
                  growth.
                </p>
              </div>
            </div>
          )}

          <div
              className={`fixed ${showMobileMenu ? 'top-0' : '-top-[100%]'} left-0 w-full z-[100] bg-white h-[26%] p-5 duration-200`}
              style={{ boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)' }}
          >
              <div className={'flex flex-col gap-y-3'}>
                <div className={'flex justify-end'}>
                  <BsXLg
                    className={'cursor-pointer'}
                    fontSize={20}
                    onClick={() => setMobileMenu(false)}
                  />
                </div>
                {menuItems.map((item, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center ${item.disabled ? 'opacity-30 pointer-events-none' : ''}`}
                  >
                    <p
                      className={'text-navyblue text-sm cursor-pointer'}
                      onClick={() => {
                        setMobileMenu(false);
                        item.onClick?.();
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
          </div>

          {/*<Disclosure.Panel className='lg:hidden'>*/}
          {/*  <div className='flex flex-col items-center space-y-2 py-3'>*/}
          {/*    {menuItems.map((item) => {*/}
          {/*      return (*/}
          {/*        <Link href={item.url} key={item.label}>*/}
          {/*          <div className='block py-2 text-base font-medium text-white-600 hover:text-white-400'>*/}
          {/*            {item.label === 'Launch App' ? (*/}
          {/*              <button className='text-black bg-white px-3 py-2 rounded-full'>*/}
          {/*                {item.label}*/}
          {/*              </button>*/}
          {/*            ) : (*/}
          {/*              <button className='text-navyblue hover:text-gray-200'>*/}
          {/*                {item.label}*/}
          {/*              </button>*/}
          {/*            )}*/}
          {/*          </div>*/}
          {/*        </Link>*/}
          {/*      );*/}
          {/*    })}*/}
          {/*  </div>*/}
          {/*</Disclosure.Panel>*/}
        </>
      )}
    </Disclosure>
  );
};

interface NavMenuProps { }

export default NavMenu;
