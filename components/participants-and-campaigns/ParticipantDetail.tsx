import React, {useEffect, useState} from 'react';

import { useSearchParams } from "next/navigation";
import { AxiosResponse } from "axios";

import httpService from "@/services/http-service";
import FavoriteIcon from "@/components/participants-and-campaigns/FavoriteIcon";
import Score from "@/components/participants-and-campaigns/Score";
import BackButton from "@/components/common/BackButton";

const ParticipantDetail = () => {
  const params = useSearchParams();
  const [participantData, setParticipantData] = useState<any>();
  const planId: string | null = params.get('planId');
  const participantId: string | null = params.get('participantId');
  const campaignId: string | null = params.get('campaignId');
  const [campaigns, setCampaigns] = useState<{ [id: string]: boolean; }>({});
  const [notes, setNotes] = useState<string>('');

  const scores: { label: string; value: string }[] = [
    { label: 'Retirement', value: 'Retirement' },
    { label: 'Financial Planning', value: 'Financial Planning' },
    { label: 'Investment', value: 'Investment' },
    { label: 'Estate Planning', value: 'Estate Planning' },
    { label: 'Tax Planning', value: 'Tax Planning' }
  ]

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response: AxiosResponse = await httpService.get(`/v1/advisor/plan/${planId}/participant/${participantId}`);
        setParticipantData(response.data);
        setNotes(response.data.notes);
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
      notes: string;
    } = {
      exclude_from: [],
      include_in: [],
      notes: notes ?? ''
    };

    Object.keys(campaigns).forEach((campaign) => {
      campaigns[campaign] ? data.include_in.push(campaign) : data.exclude_from.push(campaign);
    });
    if (participantData?.notes) {
      data.notes = participantData?.notes;
    }
    try {
      const response: AxiosResponse = await httpService.post(`/v1/advisor/plan/${planId}/participant/${participantId}/campaigns`, data);
    }
    catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <div>
      <BackButton
        url={campaignId ? `/campaign-detail?planId=${planId}&campaignId=${campaignId}` : `/participants-and-campaigns?planId=${planId}`}
      />
      <div className={'mt-3 md:mt-5 flex flex-col gap-y-3'}>
        <div className={'flex flex-col gap-y-3'}>
          <div className={'flex flex-col gap-y-3 md:gap-y-0 md:flex-row md:justify-between md:items-center'}>
            <p className={'text-navyblue text-base md:text-lg'}>Plan: {participantData?.plan_name}</p>
            <p className={'text-navyblue text-base md:text-lg'}>IdPerson: {participantData?.external_id}</p>
            <div className={'hidden md:block'}>
              {participantData && (
                <div className={'flex flex-row-reverse'}>
                  <FavoriteIcon width={30} height={30} planId={planId} participantId={participantId}
                                filled={participantData?.is_favorite}/>
                </div>
              )}
              <div className={'flex items-center mt-2'}>
                <p className={'text-3xl md:text-4xl'} style={{color: 'green'}}>{participantData?.advice_score}</p>
                &nbsp;&nbsp;/&nbsp;
                <p>100</p>
              </div>
            </div>
            <div className={'md:hidden'}>
              <div className={'flex items-center'}>
                <p className={'text-base'}>Advice Score</p>
                <p className={'text-3xl md:text-4xl ml-3'} style={{color: 'green'}}>{participantData?.advice_score}</p>
                &nbsp;&nbsp;/&nbsp;
                <p>100</p>
              </div>
              {participantData && (
                <div className={'flex items-center'}>
                  <p className={'mr-2 text-base'}>Alerts</p>
                  <FavoriteIcon width={30} height={30} planId={planId} participantId={participantId} filled={participantData?.is_favorite} />
                </div>
              )}
            </div>
          </div>
          <div className={'flex flex-col gap-y-3'}>
            <b>This person’s need for advice (/100):</b>
            <div className={'flex flex-col md:flex-row md:gap-x-14'}>
              <div>
                <Score label={'Retirement'} value={participantData?.retirement_score} scoreRight/>
                <Score label={'Investment'} value={participantData?.investing_score} scoreRight/>
                <Score label={'Tax Planning'} value={participantData?.taxes_score} scoreRight/>
              </div>
              <div>
                <Score label={'Financial Planning'} value={participantData?.finances_score} scoreRight/>
                <Score label={'Estate Planning'} value={participantData?.estate_score} scoreRight/>
              </div>
            </div>
          </div>
          <div className={'flex flex-col gap-y-3 pointer-events-none opacity-30'}>
            <b>Send me alerts as the scores increases for:</b>
            <div className={'flex flex-col md:flex-row md:flex-wrap gap-x-6'}>
              {scores.map((score, index: number) => (
                <div key={index} className={'inline-flex items-center'}>
                  <input type={'checkbox'} value={score.value} id={score.value} className={'mr-2'} />
                  <label htmlFor={score.value}>{score.label}</label>
                </div>
              ))}
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
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
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