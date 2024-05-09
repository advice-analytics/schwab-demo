import React, {useEffect, useState} from 'react';

import httpService from "@/services/http-service";
import { cellStyle, tableRowStyle, tableStyle } from "@/constants/table-styles";
import Search from "@/components/common/Search";
import Link from "next/link";

interface CampaignsProps {
  planId: string | number;
}

let cachedCampaigns: any = null;

const Index: React.FC<CampaignsProps> = ({ planId }) => {
  const [campaignsData, setCampaigns] = useState<any>({});

  const handleSearch = async (searchText: string) => {
    const results = cachedCampaigns?.campaigns?.filter((participant: any) => {
      return `${participant.name.toLowerCase()}`.includes(searchText.toLowerCase());
    });
    setCampaigns({ ...campaignsData, 'campaigns': results });
  }

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await httpService.get(`/v1/advisor/plan/${planId}`);
        cachedCampaigns = response.data;
        setCampaigns(response.data);
      }
      catch (error: any) {
        throw new Error(error.toString());
      }
    };

    fetchCampaigns();
  }, [planId]);

  return (
    <div className={'flex flex-col gap-y-5 mt-3'}>
      <div className={'flex flex-col md:flex-row gap-y-3 justify-between'}>
        <Search handleSearch={handleSearch} />
        <Link href={'/advisor/create-campaign'} target={'_blank'}>
          <button className={'btn-primary bg-navyblue hover:bg-darknavyblue text-white w-full md:w-fit h-11 rounded-md px-6 font-medium'}>
            Create Campaign
          </button>
        </Link>
      </div>
      <table style={tableStyle}>
        <thead>
        <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Name</th>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}># On List</th>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Last Update</th>
        </tr>
        </thead>
        <tbody>
        {campaignsData?.campaigns?.map((campaign: any, index: number) => (
          <tr key={index} style={tableRowStyle}>
            <td style={cellStyle}>
              <div>{campaign.name}</div>
            </td>
            <td style={cellStyle}>{campaign.count}</td>
            <td style={cellStyle}>{campaign.last_update_date}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default Index;