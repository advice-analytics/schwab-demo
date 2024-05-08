'use client';

import React, { useState } from 'react';

export interface Tab {
  title: string;
  content: React.ReactNode;
}

interface TabView {
  tabs: Tab[]
}

const TabView: React.FC<TabView> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleTabClick = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  }

  return (
    <div>
      <div className={'flex border-b-[1.5px]'}>
        {tabs?.map((tab: Tab, index: number) => (
          <div
            key={index}
            className={`px-5 py-3 cursor-pointer font-bold ${selectedTab === index ? 'bg-gray-200' : 'bg-white'}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div className={'py-3'}>
        {tabs?.[selectedTab].content}
      </div>
    </div>
  );
}

export default TabView;