import React, { useRef } from 'react';

import Image from "next/image";

import { BsSearch } from "react-icons/bs";

const Search: React.FC<{ handleSearch: any }> = ({ handleSearch }) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={'flex items-center'}>
      <input
        className={'rounded-l h-11 w-full md:w-[20rem] outline-none p-3.5'}
        placeholder={'Search...'}
        style={{ border: '1px solid lightgrey' }}
        ref={searchInputRef}
      />
      <button
        className={`bg-navyblue h-11 text-white rounded-r py-1 px-4`}
        onClick={() => handleSearch(searchInputRef.current?.value)}
      >
        <BsSearch />
      </button>
    </div>
  );
}

export default Search;