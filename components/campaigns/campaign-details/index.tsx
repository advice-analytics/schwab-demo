import React, {useEffect, useState} from 'react';

import {useRouter, useSearchParams} from "next/navigation";
import BackButton from "@/components/common/BackButton";
import TabView, {Tab} from "@/components/common/TabView";
import CampaignDetail from "@/components/campaigns/campaign-details/CampaignDetail";
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import Message from "@/components/campaigns/campaign-details/Message";
import {getNumberInUSFormat} from "@/utilities/utils";

const Label: React.FC<{ title: string; value: string; }> = ({ title, value }) => (
  <p>
    {title}
    <span className={'ml-2'}>
      <b>{value}</b>
    </span>
  </p>
);

const Index = () => {
  const router = useRouter();
  const params = useSearchParams();
  const campaignId: string = params?.get('campaignId') ?? '';
  const planId: string = params?.get('planId') ?? '';
  const [campaignInfo, setCampaignInfo] = useState<any>({});

  const tabs: Tab[] = [
    {
      title: 'Participants List',
      content: (
        <CampaignDetail
          planId={planId}
          campaignId={campaignId}
          campaignName={campaignInfo?.name}
        />
      )
    },
    {
      title: 'Message',
      content: (
        <Message
          planId={planId}
          campaignName={campaignInfo?.name}
          campaignType={campaignInfo?.msg_type}
          advisorScore={campaignInfo?.target_advice_scores}
          ageGroup={campaignInfo?.target_age_groups}
          campaignId={campaignId}
          campaignMsg={campaignInfo?.campaign_msg}
          suggestedMsg={campaignInfo?.suggested_campaign_msg}
          hideDelete={campaignInfo?.hide_delete}
        />
      ),
      active: true
    }
  ];

  const msgTypes: string[] = [];
  const adviceScoreOptions: string[] = [];

  campaignInfo?.msg_type?.forEach((msgType: string) => {
    msgTypes.push(msgType.charAt(0).toUpperCase() + msgType.slice(1));
  })

  campaignInfo?.target_advice_scores?.forEach((score: string) => {
    adviceScoreOptions.push(score.charAt(0).toUpperCase() + score.slice(1));
  })

  useEffect(() => {
    const fetchCampaignInfo = async () => {
      try {
        const response: AxiosResponse = await httpService.get(`/v1/advisor/campaign/${campaignId}`);
        setCampaignInfo(response.data);
      }
      catch (error: any) {
        throw new Error(error);
      }
    };

    fetchCampaignInfo();
  }, []);

  const handleEditClick = () => {
    router.push(`/create-campaign?planId=${planId}&campaignId=${campaignId}&edit=true`);
  }

  return (
    <div className={'flex flex-col gap-y-6'}>
      <BackButton url={`/participants-and-campaigns?planId=${planId}`} />
      <div className={'flex flex-col gap-y-2'}>
        <Label title={'Plan:'} value={campaignInfo?.plan_name} />
        <Label title={'Campaign:'} value={campaignInfo?.name} />
        <Label title={'List Size:'} value={campaignInfo?.count?.toLocaleString()} />
        <div className={'border border-solid mt-3 mb-3'} />
        <div className={'flex flex-col gap-y-2 w-full md:w-[24rem]'}>
          <div className={'flex items-center justify-between'}>
            <b>Targeting Criteria</b>
            <button
              className={`underline cursor-pointer text-navyblue font-bold ${campaignInfo?.hide_delete ? 'pointer-events-none opacity-30' : ''}`}
              onClick={handleEditClick}
            >
              Edit
            </button>
          </div>
          <Label title={'Type:'} value={msgTypes.join(' or ')} />
          <Label title={'Age:'} value={campaignInfo?.target_age_groups?.toString()} />
          <Label title={'Advice Focus:'} value={adviceScoreOptions.join(', ')} />
          <Label
            title={'Income:'}
            value={`${getNumberInUSFormat(campaignInfo?.income_from) ?? '[ ]'} to ${getNumberInUSFormat(campaignInfo?.income_to) ?? '[ ]'}`} />
          <Label title={'Balance:'} value={`${getNumberInUSFormat(campaignInfo?.balance_from) ?? '[ ]'} to ${getNumberInUSFormat(campaignInfo?.balance_to) ?? '[ ]'}`} />
        </div>
      </div>
      <TabView tabs={tabs}/>
    </div>
  );
};

export default Index;