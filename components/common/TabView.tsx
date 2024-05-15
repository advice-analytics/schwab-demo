'use client';

import React, {useEffect, useState} from 'react';

export interface Tab {
  title: string;
  content: React.ReactNode;
  active?: boolean;
}

interface TabView {
  tabs: Tab[]
}

const TabView: React.FC<TabView> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState<number | undefined>();

  const handleTabClick = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  }

  useEffect(() => {
    if (selectedTab === undefined) {
      let activeTab: number = 0;

      tabs?.forEach((tab: Tab, index: number) => {
        if (tab.active) {
          activeTab = index;
        }
      });

      setSelectedTab(activeTab);
    }
  }, [tabs]);

  return (
    <div>
      <div className={'flex border-b-[1.5px]'}>
        {tabs?.map((tab: Tab, index: number) => (
          <div
            key={index}
            className={`px-5 py-3 cursor-pointer font-bold ${selectedTab === index ? 'bg-gray-200 rounded-t border-b-[3px] border-solid border-navyblue' : 'bg-white'}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className={'py-3'}>
        {selectedTab !== undefined && tabs?.[selectedTab]?.content}
      </div>
    </div>
  );
}

export default TabView;