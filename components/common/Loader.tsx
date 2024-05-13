'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import { EVENT_CONSTANTS } from "@/constants/utils";

const Loader = () => {
  const [loading, setLoading] = useState<boolean>(false);

  if (typeof window !== 'undefined') {
    document.addEventListener(EVENT_CONSTANTS.loaderEvent, (event: any) => {
      setLoading(event.showLoader);
    });
  }

  return (
    <div
      className={
        `fixed bg-gray-300 bg-opacity-60 z-[1000] h-full w-full top-0 left-0 flex items-center justify-center ${!loading && 'hidden'}`
      }
    >
      <div className={'loader'} />
    </div>
  );
};

export default Loader;
