import React, {useEffect, useState} from 'react';

import download from 'downloadjs';

import httpService from "@/services/http-service";
import { cellStyle, tableRowStyle, tableStyle } from "@/constants/table-styles";
import Search from "@/components/common/Search";
import Image from "next/image";
import {AxiosResponse} from "axios";
import {useRouter} from "next/navigation";

interface CampaignsProps {
  planId: string | number;
}

let cachedCampaigns: any = null;

const Index: React.FC<CampaignsProps> = ({ planId }) => {
  const router = useRouter();
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

  const handleEditClick = (campaignId: string) => {
    router.push(`/advisor/create-campaign?planId=${planId}&campaignId=${campaignId}&edit=true`);
  }

  const handleDownload = async (campaignId: string, campaignName: string) => {
    try {
      const response: AxiosResponse = await httpService.get(`/v1/advisor/campaign/${campaignId}/download`, {
        responseType: 'blob'
      });
      const contentType: string = response.headers['content-type'];
      download(response.data, `${campaignName}.csv`, contentType);
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
          onClick={() => router.push(`/advisor/create-campaign?planId=${planId}`)}
        >
          Create Campaign
        </button>
      </div>
      <table style={tableStyle}>
        <thead>
        <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Name</th>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}># On List</th>
          <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Last Update</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          {campaignsData?.campaigns?.map((campaign: any, index: number) => (
            <tr key={index} style={tableRowStyle}>
              <td style={cellStyle}>
                <p
                  className={'underline text-navyblue cursor-pointer inline-block'}
                  onClick={() => router.push(`/advisor/campaign-detail?planId=${planId}&campaignId=${campaign.id}`)}
                >
                  {campaign.name}
                </p>
              </td>
              <td style={cellStyle}>{campaign.count}</td>
              <td style={cellStyle}>{campaign.last_update_date}</td>
              <td>
                <div className={'w-full flex justify-center items-center gap-x-2'}>
                  <Image src={'/download.png'} alt={''} width={30} height={30} className={'cursor-pointer'} onClick={
                    () => handleDownload(campaign.id, campaign.name)
                  } />
                  <Image src={'/pen.png'} alt={''} width={24} height={24} className={'cursor-pointer'} onClick={
                    () => handleEditClick(campaign.id)
                  } />
                  {!campaign?.hide_delete && (
                    <Image
                      src={'/delete.png'}
                      alt={''}
                      width={24}
                      height={24}
                      className={'cursor-pointer'}
                      onClick={() => handleDeleteClick(campaign.id)}
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