'use client';

import React, { FC, useEffect, useState } from 'react';

import { Client, Plan } from "@/types/PlanTypes";
import { Participant } from "@/types/ParticipantTypes";
import { useAuth } from "@/components/context/authContext";
import { auth, getValuePropFromDatabase, saveValuePropToDatabase } from "@/utilities/firebaseClient";
import PlanTable from "@/components/advisor/tables/PlanTable";
import ClientTable from "@/components/advisor/tables/ClientTable";
import ValueProp from "@/components/advisor/value/ValueProp";
import AdvisorBanner from "@/components/advisor/banner/AdvisorBanner";
import PlanHealth from "@/components/plan-health";
import { useRouter } from "next/navigation";
import CreateCampaign from "@/components/campaigns/CreateCampaign";
import CreatePlan from "@/components/plans/CreatePlan";
import ParticipantsAndCampaigns from "@/components/participants-and-campaigns";
import httpService from "@/services/http-service";
import {AxiosResponse} from "axios";
import ParticipantDetail from "@/components/participants-and-campaigns/ParticipantDetail";
import Index from "../campaigns/campaign-details";
import Link from "next/link";
import {getNumberInUSFormat, getNumInCommaFormat, getTodayFormattedDate} from "@/utilities/utils";

interface NavigationItem {
  id: number;
  label: string;
  disabled?: boolean;
  route: string;
}

interface NavMenuWrapperProps {
  activeItem: string;
}

let cachedPlans: Plan[] = [];

const NavMenuWrapper: FC<NavMenuWrapperProps> = ({ activeItem }) => {
  const [navigationItems] = useState<NavigationItem[]>([
    { id: 1, label: 'All Plans', route: '/' },
    { id: 3, label: 'Coming Soon...', disabled: true, route: '/' },
    { id: 4, label: 'Coming Soon...', disabled: true, route: '/' },
  ]);

  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isHealthModalOpen, setHealthModalOpen] = useState(false);
  const [initialValue, setInitialValue] = useState<string>(''); // State for initial value

  const [userData, loadingAuth] = useAuth();
  const userUid: string = userData?.uid || '';

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response: AxiosResponse = await httpService.get('/v1/advisor/plan');
        if (response?.status !== 200) {
          throw new Error('Failed to fetch plans');
        }
        const plansData: Plan[] = response.data;
        setPlans(plansData);
        cachedPlans = plansData;
      } catch (error) {
        throw error;
      }
    };

    const fetchInitialValue = async () => {
      try {
        const valueFromDatabase = await getValuePropFromDatabase(userUid);
        setInitialValue(valueFromDatabase || ''); // Set initial value or default to empty string
      } catch (error) {
        throw error;
      }
    };

    cachedPlans?.length ? setPlans(cachedPlans) : fetchPlans();
    fetchInitialValue(); // Fetch initial value for ValueProp component
  }, [userUid]);

  const handleNavigationItemClick = (item: NavigationItem) => {
    router.push(item.route);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setSelectedParticipant(null);
  };

  const handleHealthClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setHealthModalOpen(true);
  };

  const handleValuePropChange = async (newValueProp: string) => {
    try {
      await saveValuePropToDatabase(userUid, newValueProp);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const calculateSummary = (plans: Plan[]) => {
    const totalPlans = plans.length;
    //const totalParticipants: number = plans.reduce((sum, plan) => sum + (plan.participant_count ? plan.participant_count : 0), 0);
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

  const renderContent = () => {
    switch (activeItem) {
      case 'All Plans':
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
            {selectedParticipant && (
              <ClientTable
                clients={selectedParticipant.clients || []}
                onSelect={(client: Client) => {}}
                selectedParticipant={selectedParticipant}
              />
            )}
          </div>
        );
      case 'Value Proposition':
        return (
          <ValueProp
            uid={userUid} // Pass userUid directly as uid
            onValuePropChange={handleValuePropChange}
            initialValue={initialValue} // Pass the fetched initial value to ValueProp
          />
        );
      case 'Create Campaign':
        return <CreateCampaign />
      case 'Value Prop':
        return (
          <ValueProp
            uid={auth.currentUser?.uid || ''} // Use 'uid' instead of 'userId'
            initialValue="Default Value"
            onValuePropChange={(newValueProp) => {
              // Handle changes to the value proposition here if needed
              saveValuePropToDatabase(auth.currentUser?.uid || '', newValueProp); // Save value proposition to database
            }}
          />
        )
      case 'Create Plan':
        return <CreatePlan />
      case 'Participants and Campaigns':
        return <ParticipantsAndCampaigns />
      case 'Participant Detail':
        return <ParticipantDetail />
      case 'Campaign Detail':
        return <Index />
      case 'Plan Health':
        return <PlanHealth />
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <div className="nav-container max-h-[calc(100vh-3rem)] overflow-y-auto">
        <AdvisorBanner />
        {navigationItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNavigationItemClick(item)}
            className={`nav-item`}
            style={{
              color: item.disabled ? 'gray' : 'navyblue',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              fontWeight: `${item.label === activeItem ? 'bold' : 'normal'}`
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="content-container">
        {renderContent()}
        {/*{selectedPlan && (*/}
        {/*  <PlanHealth*/}
        {/*    isOpen={isHealthModalOpen}*/}
        {/*    onClose={() => {*/}
        {/*      setSelectedPlan(null);*/}
        {/*      setHealthModalOpen(false);*/}
        {/*    }}*/}
        {/*    plan={selectedPlan}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
    </div>
  );
};

export default NavMenuWrapper;