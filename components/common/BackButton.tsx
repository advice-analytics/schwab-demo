import React from 'react';

import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <div
      className={'flex items-center text-navyblue underline cursor-pointer'}
      onClick={() => router.back()}
    >
      <p>&lt;&lt; Back</p>
    </div>
  );
};

export default BackButton;