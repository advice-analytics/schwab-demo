'use client';

import React, { useEffect, useState } from 'react';

import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import { useAuth } from "@/components/context/authContext";
import { AxiosResponse } from "axios";
import httpService from "@/services/http-service";
import { BsArrowDown, BsArrowCounterclockwise } from "react-icons/bs";
import { useSearchParams } from "next/navigation";

interface MessagePropType {
  planId: string;
  campaignName: string;
  campaignType: string[];
  advisorScore: string[];
  ageGroup: string[];
  campaignId: string;
  campaignMsg?: string;
  suggestedMsg?: string;
  hideDelete?: boolean;
}

const Message: React.FC<MessagePropType> = ({ planId, campaignName, campaignType, advisorScore, ageGroup, campaignId, hideDelete, campaignMsg = '', suggestedMsg = '' }) => {
  const [userData, loadingAuth] = useAuth();
  const [userMessage, setUserMessage] = useState<string>(campaignMsg);
  const [genAImessage, setGenAImessage] = useState<string>(suggestedMsg);
  const params = useSearchParams();
  const regenerateAIMsg: boolean = (params?.get('regenerate') === 'true') ?? false;

  const handleSaveClick = async (campaignMsgVar: string, suggestedCampaignMsgVar: string) => {
    const data: {
      campaign_msg: string;
      suggested_campaign_msg: string;
      id: string;
    } = {
      campaign_msg: campaignMsgVar,
      suggested_campaign_msg: suggestedCampaignMsgVar,
      id: campaignId
    };
    try {
      const response: AxiosResponse = await httpService.post('/v1/advisor/campaign', data);
    }
    catch (error: any) {
      throw new Error(error);
    }
  };

  const generateAImessage = async () => {
    const message: string = await generateCampaignPrompt(
      planId,
      campaignName,
      campaignType?.join(', '),
      advisorScore?.join(', '),
      ageGroup?.join(', '),
      userMessage,
      userData?.uid || ''
    );
    setGenAImessage(message);
    !campaignMsg && setUserMessage(message);
    return message;
  };

  useEffect(() => {
    const fetchGenAIMsg = async () => {
      const message: string = await generateAImessage();
      await handleSaveClick(campaignMsg ? campaignMsg : message, message);
    };

    campaignMsg && setUserMessage(campaignMsg);
    if (regenerateAIMsg && campaignName) {
      fetchGenAIMsg();
    }
  }, [campaignName]);

  useEffect(() => {
    if (!regenerateAIMsg) {
      setGenAImessage(suggestedMsg);
    }
  }, [suggestedMsg]);

  const handleRegenerateClick = async () => {
    generateAImessage();
  }

  const handleCopy = async () => {
    setUserMessage(genAImessage);
  }

  return (
    <div className={'flex flex-col gap-y-5'}>
      <b>Please review carefully for mistakes.</b>
      <div>
        <div className={'flex justify-between'}>
          <b>Suggested campaign messaging</b>
          <div
            className={'inline-flex items-center cursor-pointer'}
            onClick={handleRegenerateClick}
          >
            <p
              className={'text-navyblue mr-0.5 underline'}
            >
              Regenerate
            </p>
            <BsArrowCounterclockwise fontSize={16} style={{ color: '#144E74' }} className={'mt-0.5'} />
          </div>
        </div>
        <textarea
          className="rounded h-[20rem] w-full p-3 mt-3 outline-none resize-none"
          style={{ border: '1px solid lightgrey' }}
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
          <BsArrowDown />
        </button>
      </div>
      <div>
        <b>You can edit & save here</b>
        <textarea
          className="rounded h-[20rem] w-full p-3 mt-3 outline-none resize-none"
          style={{ border: '1px solid lightgrey' }}
          placeholder={'Enter...'}
          value={userMessage}
          onChange={(event) => {
            setUserMessage(event.target.value);
          }}
        />
      </div>
      <div className={'text-center'}>
        <button
          className={`btn-primary bg-navyblue hover:bg-darknavyblue text-white rounded-md py-2 px-5 font-medium ${hideDelete ? 'pointer-events-none opacity-30' : ''}`}
          onClick={() => handleSaveClick(userMessage, genAImessage)}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Message;