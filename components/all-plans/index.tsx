import React, {useEffect, useState} from 'react';

import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import {getNumberInUSFormat, getNumInCommaFormat, getTodayFormattedDate} from "@/utilities/utils";
import Link from "next/link";
import PlanTable from "@/components/advisor/tables/PlanTable";
import ClientTable from "@/components/advisor/tables/ClientTable";
import {Client, Plan} from "@/types/PlanTypes";

const Index = () => {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const intialRequests = async () => {
      const fetchPlans = async () => {
        try {
          const response: AxiosResponse = await httpService.get('/v1/advisor/plan');
          if (response?.status !== 200) {
            throw new Error('Failed to fetch plans');
          }
          const plansData: Plan[] = response.data;
          setPlans(plansData);
        } catch (error) {
          throw error;
        }
      };

      const getAdvisor = async () => {
        try {
          const response: AxiosResponse = await httpService.get('/v1/advisor/profile');
        }
        catch (error) {
          throw error;
        }
      };

      await getAdvisor();
      fetchPlans();
    };

    intialRequests();
  }, []);

  const calculateSummary = (plans: Plan[]) => {
    const totalPlans = plans.length;
    let totalParticipants: number = 0;
    let totalAssets: number = 0;

    plans?.forEach((plan: Plan) => {
      totalParticipants += plan.participant_count;
      totalAssets += plan.metrics.total_assets;
    });

    return {
      totalPlans,
      totalAssets: getNumberInUSFormat(totalAssets),
      totalParticipants: getNumInCommaFormat(totalParticipants),
    };
  };

  const summary = calculateSummary(plans);

  return (
    <div className={'flex flex-col gap-y-4 md:gap-y-8'}>
      <div className={'text-center md:text-left'}>
        <p className={'text-base'}>{getTodayFormattedDate()}</p>
      </div>
      <div className={'flex flex-col gap-y-3 md:flex-row md:justify-between'}>
        <div>
          <div className={'text-center'}>
            <p className={'text-base'}>Total Plans</p>
          </div>
          <div className={'text-center'}>
            <b className={'text-lg'}>{summary?.totalPlans}</b>
          </div>
        </div>
        <div>
          <div className={'text-center'}>
            <p className={'text-base'}>Total Assets</p>
          </div>
          <div className={'text-center'}>
            <b className={'text-lg'} style={{ color: 'green' }}>{summary?.totalAssets}</b>
          </div>
        </div>
        <div>
          <div className={'text-center'}>
            <p className={'text-base'}>Total Participants</p>
          </div>
          <div className={'text-center'}>
            <b className={'text-lg text-navyblue'}>{summary?.totalParticipants}</b>
          </div>
        </div>
      </div>
      <div className={'flex justify-center md:justify-start'}>
        <Link href={'/create-plan'} target={'_blank'}>
          <button
            className={'btn-primary bg-navyblue hover:bg-darknavyblue text-white rounded-md pl-5 pr-5 h-11 font-medium opacity-30'}
            title={'Coming soon...'}
            disabled
          >
            Add Plan
          </button>
        </Link>
      </div>
      <PlanTable plans={plans} totalAssets={summary.totalAssets} />
      {/*{selectedParticipant && (*/}
      {/*  <ClientTable*/}
      {/*    clients={selectedParticipant.clients || []}*/}
      {/*    onSelect={(client: Client) => {}}*/}
      {/*    selectedParticipant={selectedParticipant}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
};

export default Index;