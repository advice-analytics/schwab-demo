// Footer.tsx
import React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import LogoImage from '@/public/main-logo.png';

const Footer: React.FC = () => {
  return (
    <footer id="App:Footer" className="bg-white bottom-0 w-full flex items-center shadow-lg border-t-2 border-transparent h-[4rem]">
      <div className="flex flex-col lg:flex-row w-full justify-between items-center px-6">
        <p className="text-gray-600">&copy; {new Date().getFullYear().toString()} CommsAI</p>
        <div className="flex items-center">
          {/*<Link href="/docs">*/}
          {/*  <NextImage*/}
          {/*    className="w-auto h-10 lg:w-auto"*/}
          {/*    src={LogoImage}*/}
          {/*    alt=""*/}
          {/*    width={300}*/}
          {/*    height={300}*/}
          {/*  />*/}
          {/*</Link>*/}
          <span className="ml-4">
            <Link href="https://adviceanalytics.com/legal/terms-of-service/" className="text-navyblue hover:text-navyblue underline">
              Disclosure of Terms
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
