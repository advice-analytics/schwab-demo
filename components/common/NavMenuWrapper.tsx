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

  const renderContent = () => {
    switch (activeItem) {
      case 'All Plans':
        return (
          <>
            <div className={'flex flex-row-reverse justify-between'}>
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
            <PlanTable plans={plans} />
            {selectedParticipant && (
              <ClientTable
                clients={selectedParticipant.clients || []}
                onSelect={(client: Client) => {}}
                selectedParticipant={selectedParticipant}
              />
            )}
          </>
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