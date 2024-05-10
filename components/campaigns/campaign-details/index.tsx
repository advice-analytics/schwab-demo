import React, {useEffect, useState} from 'react';

import {useSearchParams} from "next/navigation";
import BackButton from "@/components/common/BackButton";
import TabView, {Tab} from "@/components/common/TabView";
import CampaignDetail from "@/components/campaigns/campaign-details/CampaignDetail";
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import Message from "@/components/campaigns/campaign-details/Message";

const Index = () => {
  const params = useSearchParams();
  const campaignId: string = params?.get('campaignId') ?? '';
  const planId: string = params?.get('planId') ?? '';
  const [campaignInfo, setCampaignInfo] = useState<any>({});

  const tabs: Tab[] = [
    {
      title: 'Participants List',
      content: <CampaignDetail planId={planId} campaignId={campaignId} />
    },
    {
      title: 'Message',
      content: (
        <Message
          planId={planId}
          campaignName={campaignInfo?.name}
          campaignType={campaignInfo?.msg_type?.[0]}
          advisorScore={campaignInfo?.advice_score}
          ageGroup={campaignInfo?.target_age_groups}
          campaignId={campaignId}
          campaignMsg={campaignInfo?.campaign_msg}
          suggestedMsg={campaignInfo?.suggested_campaign_msg}
        />
      )
    }
  ]

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

  return (
    <div className={'flex flex-col gap-y-6'}>
      <BackButton />
      <div>
        <p>
          Plan:
          <span className={'ml-2'}>
            <b>{campaignInfo?.plan_name}</b>
          </span>
        </p>
        <p>
          Campaign:
          <span className={'ml-2'}>
            <b>{campaignInfo?.name}</b>
          </span>
        </p>
      </div>
      <TabView tabs={tabs}/>
    </div>
  );
};

export default Index;