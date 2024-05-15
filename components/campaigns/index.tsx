import React, {useEffect, useState} from 'react';

import httpService from "@/services/http-service";
import { cellStyle, tableRowStyle, tableStyle } from "@/constants/table-styles";
import Search from "@/components/common/Search";
import {AxiosResponse} from "axios";
import {useRouter} from "next/navigation";
import { BsFillTrashFill } from "react-icons/bs";

interface CampaignsProps {
  planId: string | number;
}

let cachedCampaigns: any = null;

const Index: React.FC<CampaignsProps> = ({ planId }) => {
  const router = useRouter();
  const [campaignsData, setCampaigns] = useState<any>([]);

  const handleSearch = async (searchText: string) => {
    const results = cachedCampaigns?.campaigns?.filter((participant: any) => {
      return `${participant.name.toLowerCase()}`.includes(searchText.toLowerCase());
    });
    setCampaigns({ ...campaignsData, 'campaigns': results });
  }

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await httpService.get(`/v1/advisor/plan/${planId}/campaigns`);
        cachedCampaigns = response.data;
        setCampaigns(response.data);
      }
      catch (error: any) {
        throw new Error(error.toString());
      }
    };

    fetchCampaigns();
  }, [planId]);

  const handleDeleteClick = async (deleteCampaignId: string) => {
    try {
      const response: AxiosResponse = await httpService.delete(`/v1/advisor/campaign/${deleteCampaignId}`);
      const updatedCampaigns = campaignsData?.campaigns?.filter((campaign: any) => campaign.id !== deleteCampaignId);
      setCampaigns({...campaignsData, 'campaigns': updatedCampaigns});
    }
    catch (error: any) {
      throw new Error(error);
    }
  }

  return (
    <div className={'flex flex-col gap-y-5 mt-3'}>
      <div className={'flex flex-col md:flex-row gap-y-3 justify-between'}>
        <Search handleSearch={handleSearch} />
        <button
          className={'btn-primary bg-navyblue hover:bg-darknavyblue text-white w-full md:w-fit h-11 rounded-md px-6 font-medium'}
          onClick={() => router.push(`/create-campaign?planId=${planId}`)}
        >
          Create Campaign
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
        <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>Name</th>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>Number of Participants</th>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'pre-wrap' }}>Last Update</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
          {campaignsData?.map((campaign: any, index: number) => (
            <tr key={index} style={tableRowStyle}>
              <td style={cellStyle}>
                <p
                  className={'underline text-navyblue cursor-pointer inline-block'}
                  onClick={() => router.push(`/campaign-detail?planId=${planId}&campaignId=${campaign.id}`)}
                >
                  {campaign.name}
                </p>
              </td>
              <td style={cellStyle}>{campaign.count}</td>
              <td style={cellStyle}>{campaign.last_update_date}</td>
              <td>
                <div className={'w-full pl-4 pr-4 md:pr-0 flex flex-col gap-y-1 md:flex-row items-center md:gap-x-2'}>
                  {!campaign?.hide_delete && (
                    <BsFillTrashFill
                      className={'cursor-pointer'}
                      fontSize={20}
                      onClick={() => handleDeleteClick(campaign.id)}
                      title={'Delete'}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Index;