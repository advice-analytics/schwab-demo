import React from 'react';

import { useRouter } from "next/navigation";

interface BackButtonProps {
  url?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ url }) => {
  const router = useRouter();

  const handleBackButtonClick = () => {
    url ? router.push(url) : router.back();
  }

  return (
    <div
      className={'inline-flex items-center'}
    >
      <b
        className={'text-navyblue underline cursor-pointer'}
        onClick={handleBackButtonClick}
      >
        &lt; Back
      </b>
    </div>
  );
};

export default BackButton;