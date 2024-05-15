import React from 'react';
import TabView, { Tab } from "@/components/common/TabView";
import FileUpload from "@/components/common/FileUpload";

const CreatePlan: React.FC = () => {
  const tabs: Tab[] = [
    {
      title: 'From File',
      content: (
        <div>
          <div className={'flex flex-col items-start gap-y-3'}>
            Please download our data template file
            <button
              className={'btn-primary bg-navyblue hover:bg-darknavyblue text-white rounded-md pl-5 pr-5 h-11 font-medium'}
            >
              Download Template
            </button>
          </div>
          <div className={'flex flex-col items-start gap-y-3 mt-5'}>
            Please upload only one file for each plan
            <input
              className={'rounded h-11 w-[20rem] outline-none p-3.5'}
              style={{border: '1px solid lightgrey'}}
              placeholder={'Plan Name'}
            />
            <FileUpload uploadURL={''} />
          </div>
        </div>
      )
    },
    {
      title: 'From RecordKeeper',
      content: <>2</>
    }
  ];

  return (
    <div>
      <TabView tabs={tabs}/>
    </div>
  );
}

export default CreatePlan;