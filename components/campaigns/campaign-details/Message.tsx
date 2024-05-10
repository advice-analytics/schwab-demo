'use client';

import React, {useEffect, useState} from 'react';

import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import {useAuth} from "@/components/context/authContext";
import Image from "next/image";
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";

interface MessagePropType {
  planId: string;
  campaignName: string;
  campaignType: string;
  advisorScore: string[];
  ageGroup: string[];
  campaignId: string;
  campaignMsg?: string;
  suggestedMsg?: string;
}

const Message: React.FC<MessagePropType> = ({ planId, campaignName, campaignType, advisorScore, ageGroup, campaignId, campaignMsg = '', suggestedMsg = '' }) => {
  const [userData, loadingAuth] = useAuth();
  const [userMessage, setUserMessage] = useState<string>(campaignMsg);
  const [genAImessage, setGenAImessage] = useState<string>(suggestedMsg);

  const handleSaveClick = async () => {
    const data: {
      campaign_msg: string;
      suggested_campaign_msg: string;
      id: string;
    } = {
      campaign_msg: userMessage,
      suggested_campaign_msg: genAImessage,
      id: campaignId
    };
    console.log(data)
    try {
      const response: AxiosResponse = await httpService.post('/v1/advisor/campaign', data);
      console.log(response)
    }
    catch (error: any) {
      throw new Error(error);
    }
  };

  const generateAImessage = async () => {
    const message: string = await generateCampaignPrompt(
      planId,
      campaignName,
      campaignType,
      advisorScore?.join(','),
      ageGroup?.join(', '),
      userMessage,
      userData?.uid || ''
    );
    setGenAImessage(message);
  };

  useEffect(() => {
    !suggestedMsg && generateAImessage();
  }, []);

  const handleRegenerateClick = async () => {
    generateAImessage();
  }

  const handleCopy = async () => {
    setUserMessage(genAImessage);
  }

  return (
    <div className={'flex flex-col gap-y-5'}>
      <b>Please review carefully for mistakes. You can edit below.</b>
      <div>
        <div className={'flex justify-between'}>
          <b>Suggested campaign messaging</b>
          {genAImessage && (
            <p
              className={'underline text-navyblue cursor-pointer'}
              onClick={handleRegenerateClick}
            >
              Regenerate
            </p>
          )}
        </div>
        <textarea
          className="rounded h-28 w-full p-3 mt-3 outline-none resize-none"
          style={{border: '1px solid lightgrey'}}
          placeholder={'Enter...'}
          value={genAImessage}
        />
      </div>
      <div className={'flex justify-center'}>
        <button
          className={'flex items-center gap-x-1 btn-primary bg-navyblue hover:bg-darknavyblue text-white rounded-md py-2 px-5'}
          onClick={handleCopy}
        >
          Copy AI generated message
          <Image src={'/arrow-down.png'} alt={''} width={24} height={24} className={'mt-0.5'} />
        </button>
      </div>
      <div>
        <b>You can edit & save here</b>
        <textarea
          className="rounded h-28 w-full p-3 mt-3 outline-none resize-none"
          style={{border: '1px solid lightgrey'}}
          placeholder={'Enter...'}
          value={userMessage}
          onChange={(event) => {
            setUserMessage(event.target.value);
          }}
        />
      </div>
      <div className={'text-center'}>
        <button
          className="btn-primary bg-navyblue hover:bg-darknavyblue text-white rounded-md py-2 px-5 font-medium"
          onClick={handleSaveClick}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Message;