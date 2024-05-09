import React from 'react';

import TabView, { Tab } from "@/components/common/TabView";
import Participants from "@/components/participants-and-campaigns/Participants";
import {useRouter, useSearchParams} from "next/navigation";
import Campaigns from "@/components/campaigns";

function Index() {
  const router = useRouter();
  const planId: string | null = useSearchParams()?.get('planId');

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

  return (
    <div className={'flex flex-col gap-y-5'}>
      <div
        className={'flex items-center text-navyblue underline cursor-pointer'}
        onClick={() => router.back()}
      >
        <p>&lt;&lt; Back</p>
      </div>
      <TabView tabs={tabs}/>
    </div>
  );
}

export default Index;