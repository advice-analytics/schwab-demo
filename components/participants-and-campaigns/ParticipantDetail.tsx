import React, {useEffect, useRef, useState} from 'react';

import {useRouter, useSearchParams} from "next/navigation";
import {AxiosResponse} from "axios";

import httpService from "@/services/http-service";
import FavoriteIcon from "@/components/participants-and-campaigns/FavoriteIcon";
import Score from "@/components/participants-and-campaigns/Score";

const ParticipantDetail = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [participantData, setParticipantData] = useState<any>();
  const planId: string | null = params.get('planId');
  const participantId: string | null = params.get('participantId');
  const [campaigns, setCampaigns] = useState<{ [id: string]: boolean; }>({});
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response: AxiosResponse = await httpService.get(`/v1/advisor/plan/${planId}/participant/${participantId}`);
        setParticipantData(response.data);
      }
      catch (error: any) {
        throw new Error(error);
      }
    };

    fetchParticipantDetails();
  }, [participantId, planId]);

  const handleChange = (event: { target: { value: string | number; checked: boolean; }; }) => {
    campaigns[event.target.value] = event.target.checked;
    setCampaigns({ ...campaigns });
  };

  const handleSave = async () => {
    const data: {
      exclude_from: string[];
      include_in: string[];
    } = {
      exclude_from: [],
      include_in: []
    };

    Object.keys(campaigns).forEach((campaign) => {
      campaigns[campaign] ? data.include_in.push(campaign) : data.exclude_from.push(campaign);
    });

    try {
      const response: AxiosResponse = await httpService.post(`/v1/advisor/plan/${planId}/participant/${participantId}/campaigns`, data);
    }
    catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <div>
      <div
        className={'flex items-center text-navyblue underline cursor-pointer'}
        onClick={() => router.back()}
      >
        <p>&lt;&lt; Back</p>
      </div>
      <div className={'mt-3 md:mt-5 flex flex-col gap-y-3'}>
        <div className={'flex flex-col gap-y-3'}>
          <div className={'flex justify-between items-center'}>
            <p className={'text-navyblue'}>Plan: {participantData?.plan_name}</p>
            <div>
              <div className={'flex flex-row-reverse'}>
                <FavoriteIcon width={30} height={30} planId={planId} participantId={participantId} />
              </div>
              <div className={'flex items-center mt-2'}>
                <p className={'text-2xl'} style={{ color: 'green' }}>{participantData?.advice_score}</p>
                &nbsp;&nbsp;/&nbsp;
                <p>100</p>
              </div>
            </div>
          </div>
          <div className={'flex flex-col gap-y-3'}>
            <b>Advice Score Details</b>
            <div className={'flex flex-col md:flex-row md:gap-x-14'}>
              <div>
                <Score label={'Retirement'} value={participantData?.retirement_score} style={{ color: 'green' }} />
                <Score label={'Investment'} value={participantData?.investing_score} />
                <Score label={'Tax Planning'} value={participantData?.taxes_score} />
              </div>
              <div>
                <Score label={'Financial Planning'} value={participantData?.finances_score} style={{ color: 'orange' }} />
                <Score label={'Estate Planning'} value={participantData?.estate_score} style={{ color: 'green' }} />
                <Score label={'Advice Score'} value={participantData?.advice_score} />
              </div>
            </div>
          </div>
          {(participantData?.campaigns_in?.length || participantData?.campaigns_out?.length) ? (
            <>
              <b>Include in these campaigns:</b>
              <div className={'pl-5'}>
                {participantData?.campaigns_in?.map((campaign: any, index: number) => {
                  if (campaigns[campaign.id] === undefined) {
                    campaigns[campaign.id] = true;
                  }

                  return (
                    <div key={index} className={'flex gap-x-3 items-center'}>
                      <input
                        id={campaign.name}
                        type={'checkbox'}
                        value={campaign.id}
                        onChange={handleChange}
                        checked={campaigns[campaign.id]}
                      />
                      <label htmlFor={campaign.name}>{campaign.name}</label>
                    </div>
                  )
                })}
                {participantData?.campaigns_out?.map((campaign: any, index: number) => (
                  <div key={index} className={'flex gap-x-3 items-center'}>
                    <input
                      id={campaign.name}
                      type={'checkbox'}
                      value={campaign.id}
                      onChange={handleChange}
                      checked={campaigns[campaign.id]}
                    />
                    <label htmlFor={campaign.name}>{campaign.name}</label>
                  </div>
                ))}
              </div>
            </>
          ) : ''}
        </div>
        <div className={'flex flex-col gap-y-2'}>
          <b>Notes:</b>
          <textarea
            className={'rounded w-full h-40 outline-none py-3 px-3.5 resize-none'}
            style={{border: '1px solid lightgrey'}}
            placeholder={'Enter here...'}
            ref={notesRef}
          />
        </div>
        <div className={'text-center mt-3'}>
          <button
            className={'btn-primary bg-navyblue hover:bg-darknavyblue text-white w-full md:w-fit h-11 rounded-md px-6 font-medium'}
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetail;