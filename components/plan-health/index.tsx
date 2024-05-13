import React, {useEffect, useState} from 'react';

import BackButton from "@/components/common/BackButton";
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import {useSearchParams} from "next/navigation";
import Image from "next/image";

const Index = () => {
  const [planData, setPlanData] = useState<any>({});
  const planId: string | null = useSearchParams()?.get('planId');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response: AxiosResponse = await httpService.get(`/v1/advisor/plan/${planId}`);
        setPlanData(response.data);
      }
      catch (error: any) {
        throw new Error(error);
      }
    };

    fetchPlan();
  }, [planId]);

  return (
    <div className={'flex flex-col gap-y-3 md:gap-y-5'}>
      <BackButton />
      <p>
        Plan:
        <b className={'ml-3'}>{planData?.name}</b>
      </p>
      <div className={'border border-solid'}/>
      <div className={'flex flex-col gap-y-2'}>
        <b>Plan Insights</b>
        <p>Clicking View Insights will direct you to dailyVest.com for Plan Health, Participant Action Plan, and AI
          nudge messaging</p>
      </div>
      <div className={'border border-solid'}/>
      <b>{planData?.name} Profit Sharing Plan</b>
      <div className={'flex flex-col gap-y-2'}>
        <b>Plan Health Score</b>
        <img src={'/chart.png'} alt={''} className={'w-full md:w-[20rem]'} />
      </div>
      <div className={'text-center'}>
        <button
          className={`bg-navyblue text-white rounded-md py-1 px-4 opacity-30`}
          title={'Coming Soon...'}
          disabled
        >
          View Insights
        </button>
      </div>
    </div>
  );
};

export default Index;