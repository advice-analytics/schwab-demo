'use client';

import React, { FC, useEffect, useState } from 'react';

import { useAuth } from "@/components/context/authContext";
import { auth, getValuePropFromDatabase, saveValuePropToDatabase } from "@/utilities/firebaseClient";
import ValueProp from "@/components/advisor/value/ValueProp";
import PlanHealth from "@/components/plan-health";
import CreateCampaign from "@/components/campaigns/CreateCampaign";
import CreatePlan from "@/components/plans/CreatePlan";
import ParticipantsAndCampaigns from "@/components/participants-and-campaigns";
import ParticipantDetail from "@/components/participants-and-campaigns/ParticipantDetail";
import Index from "../campaigns/campaign-details";
import AllPlans from "@/components/all-plans";

interface NavMenuWrapperProps {
  activeItem: string;
}

const NavMenuWrapper: FC<NavMenuWrapperProps> = ({ activeItem }) => {
  const [initialValue, setInitialValue] = useState<string>(''); // State for initial value

  const [userData, loadingAuth] = useAuth();
  const userUid: string = userData?.uid || '';

  useEffect(() => {
    const fetchInitialValue = async () => {
      try {
        const valueFromDatabase = await getValuePropFromDatabase(userUid);
        setInitialValue(valueFromDatabase || ''); // Set initial value or default to empty string
      } catch (error) {
        throw error;
      }
    };

    fetchInitialValue(); // Fetch initial value for ValueProp component
  }, [userUid]);

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
        return <AllPlans />;
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
      {/*<div className="nav-container max-h-[calc(100vh-3rem)] overflow-y-auto">*/}
      {/*  <AdvisorBanner />*/}
      {/*  {navigationItems.map((item) => (*/}
      {/*    <div*/}
      {/*      key={item.id}*/}
      {/*      onClick={() => handleNavigationItemClick(item)}*/}
      {/*      className={`nav-item`}*/}
      {/*      style={{*/}
      {/*        color: item.disabled ? 'gray' : 'navyblue',*/}
      {/*        cursor: item.disabled ? 'not-allowed' : 'pointer',*/}
      {/*        fontWeight: `${item.label === activeItem ? 'bold' : 'normal'}`*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {item.label}*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
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