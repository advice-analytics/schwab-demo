import React, {useEffect, useState} from 'react';

import TabView, { Tab } from "@/components/common/TabView";
import Participants from "@/components/participants-and-campaigns/Participants";
import {useSearchParams} from "next/navigation";
import Campaigns from "@/components/campaigns";
import Score from "@/components/participants-and-campaigns/Score";
import httpService from "@/services/http-service";
import BackButton from "@/components/common/BackButton";

function Index() {
  const planId: string | null = useSearchParams()?.get('planId');
  const [metricsData, setMetrics] = useState<any>({});

  const tabs: Tab[] = [
    {
      title: 'Participants',
      content: <Participants planId={planId ?? ''} />
    },
    {
      title: 'Campaigns',
      content: <Campaigns planId={planId ?? ''} />
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
      <BackButton />
      <div className={'flex flex-col gap-y-3'}>
        <div className={'flex flex-row flex-wrap gap-x-10'}>
          <p>
            Plan:
            <span className={'ml-2'}>
              <b>{metricsData?.name}</b>
            </span>
          </p>
          <p>
            Participants:
            <span className={'ml-2'}>
              <b>{metricsData?.participant_count}</b>
            </span>
          </p>
          <p>
            Plan Assets:
            <span className={'ml-2'}>
              <b>{metricsData?.total_assets?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}</b>
            </span>
          </p>
        </div>
        <div>
          <b>Number of participants with strong interest in:</b>
          <div className={'flex flex-col md:flex-row md:gap-x-16 mt-3'}>
            <div>
              <Score label={'Retirement'} value={metricsData?.metrics?.retirement_count} scoreRight/>
              <Score label={'Investment'} value={metricsData?.metrics?.investing_count} scoreRight/>
              <Score label={'Tax Planning'} value={metricsData?.metrics?.taxes_count} scoreRight/>
            </div>
            <div>
              <Score label={'Financial Planning'} value={metricsData?.metrics?.finances_count} scoreRight/>
              <Score label={'Estate Planning'} value={metricsData?.metrics?.estate_count} scoreRight/>
              <Score label={'Advisor Score'} value={metricsData?.metrics?.health} scoreRight/>
            </div>
          </div>
        </div>
      </div>
      <TabView tabs={tabs}/>
    </div>
  );
}

export default Index;