import React, {useEffect, useState} from 'react';

import TabView, { Tab } from "@/components/common/TabView";
import Participants from "@/components/participants-and-campaigns/Participants";
import {useSearchParams} from "next/navigation";
import Campaigns from "@/components/campaigns";
import Score from "@/components/participants-and-campaigns/Score";
import httpService from "@/services/http-service";
import BackButton from "@/components/common/BackButton";
import {getNumberInUSFormat} from "@/utilities/utils";

function Index() {
  const planId: string | null = useSearchParams()?.get('planId');
  const [metricsData, setMetrics] = useState<any>({});

  const tabs: Tab[] = [
    {
      title: 'Campaigns',
      content: <Campaigns planId={planId ?? ''} />
    },
    {
      title: 'Participants',
      content: <Participants planId={planId ?? ''} />
    }
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await httpService.get(`/v1/advisor/plan/${planId}`);
        setMetrics(response?.data);
      }
      catch (error: any) {
        throw new Error(error.toString());
      }
    };

    fetchMetrics();
  }, [planId]);

  return (
    <div className={'flex flex-col gap-y-5'}>
      <BackButton url={'/home'} />
      <div className={'flex flex-col gap-y-3'}>
        <div className={'flex flex-col gap-y-1'}>
          <p>
            Plan:
            <span className={'ml-2'}>
              <b className={'text-lg'}>{metricsData?.name}</b>
            </span>
          </p>
          <p>
            Plan Assets:
            <span className={'ml-2'}>
              <b style={{ color: 'green' }} className={'text-lg'}>{getNumberInUSFormat(metricsData?.metrics?.total_assets)}</b>
            </span>
          </p>
          <p>
            Participants:
            <span className={'ml-2'}>
              <b className={'text-navyblue text-lg'}>{metricsData?.participant_count?.toLocaleString()}</b>
            </span>
          </p>
        </div>
        <div>
          <b>Number of participants who need advice with:</b>
          <div className={'flex flex-col md:flex-row md:gap-x-16 mt-3'}>
            <div>
              <Score label={'Retirement'} value={metricsData?.metrics?.retirement_count} scoreRight/>
              <Score label={'Investment'} value={metricsData?.metrics?.investing_count} scoreRight/>
              <Score label={'Tax Planning'} value={metricsData?.metrics?.taxes_count} scoreRight/>
            </div>
            <div>
              <Score label={'Financial Planning'} value={metricsData?.metrics?.finances_count} scoreRight/>
              <Score label={'Estate Planning'} value={metricsData?.metrics?.estate_count} scoreRight/>
            </div>
          </div>
        </div>
      </div>
      <TabView tabs={tabs}/>
    </div>
  );
}

export default Index;