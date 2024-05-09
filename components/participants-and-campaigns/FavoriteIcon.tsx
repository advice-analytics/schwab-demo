import React, { useState } from 'react';

import Image from "next/image";

import { AxiosResponse } from "axios";
import httpService from "@/services/http-service";

interface FavoriteIconProps {
  filled?: boolean;
  width: number;
  height: number;
  planId: string | number | null;
  participantId: string | null;
}

const FavoriteIcon: React.FC<FavoriteIconProps> = ({ filled, width, height, planId, participantId }) => {
  const [filledIcon, setFilledIcon] = useState<boolean>(filled ?? false);

  const handleStarClick = async () => {
    try {
      const response: AxiosResponse = await httpService.get(`/v1/advisor/plan/${planId}/participant/${participantId}/favorite/toggle`);
      if (response.status === 200) {
        setFilledIcon((filledIcon) => !filledIcon);
      }
    }
    catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <Image
      className={'cursor-pointer'}
      src={filledIcon ? '/star.png' : '/star-outline.png'}
      alt={''}
      width={width}
      height={height}
      onClick={(event) => {
        event.stopPropagation();
        handleStarClick();
      }}
    />
  );
};

export default FavoriteIcon;