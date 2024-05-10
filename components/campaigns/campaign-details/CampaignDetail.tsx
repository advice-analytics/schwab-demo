import React, {useEffect, useState} from 'react';

import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import {cellStyle, tableRowStyle, tableStyle} from "@/constants/table-styles";
import FavoriteIcon from "@/components/participants-and-campaigns/FavoriteIcon";
import Image from "next/image";
import Search from "@/components/common/Search";

const CampaignDetail: React.FC<{ planId: string; campaignId: string; }> = ({ planId, campaignId }) => {
  const [campaignDetails, setCampaignDetails] = useState<any>();
  const [params, setParams] = useState<{
    search: string;
    page_size: number;
    page: number;
  }>({
    search: '',
    page_size: 10,
    page: 1
  });
  const noOfPages: number = Math.ceil((campaignDetails?.total_count ?? 0) / 10) || 0;

  const handleSearch = async (search: string) => {
    setParams({ ...params, search, page: 1 });
  }

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response: AxiosResponse = await httpService.get(`/v1/advisor/campaign/${campaignId}/participants?page=${params.page}&page_size=${params.page_size}&search=${params.search}`);
        setCampaignDetails(response?.data);
      }
      catch (error: any) {
        throw new Error(error);
      }
    };

    fetchCampaignDetails();
  }, [campaignId, params]);

  const handleDeleteClick = async (deletedCampaignId: string) => {
    try {
      const response: AxiosResponse = await httpService.post(
        `/v1/advisor/plan/${planId}/participant/${deletedCampaignId}/campaigns`, { exclude_from: [campaignId] }
      );
      const updatedCampaigns = campaignDetails?.participants?.filter((campaign: any) => campaign.id !== deletedCampaignId);
      setCampaignDetails({ ...campaignDetails, 'participants': updatedCampaigns });
    }
    catch (error: any) {
      throw new Error(error);
    }
  }

  const handlePageButtonClick = async (nextPage: number) => {
    setParams({ ...params, page: nextPage });
  }

  return (
    <div className={'flex flex-col mt-3'}>
      <Search handleSearch={handleSearch} />
      <table style={tableStyle} className={'mt-5'}>
        <thead>
        <tr style={{backgroundColor: '#144e74', color: 'white', textAlign: 'center'}}>
          <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Id</th>
          <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Advise Score</th>
          <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Top Interest</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {campaignDetails?.participants?.map((participant: any, index: number) => (
          <tr key={index} style={tableRowStyle}>
            <td style={cellStyle}>
              <p className={'underline text-navyblue cursor-pointer'}>
                {participant.external_id}
              </p>
            </td>
            <td style={cellStyle}>{participant.advice_score}</td>
            <td style={cellStyle}>{participant.top_interest}</td>
            <td style={cellStyle}>
              <div className={'flex justify-center gap-x-2'}>
                <FavoriteIcon width={24} height={24} planId={planId} participantId={participant.id}
                              filled={participant.is_favorite}/>
                <Image
                  src={'/delete.png'}
                  alt={''}
                  width={24}
                  height={24}
                  className={'cursor-pointer'}
                  onClick={() => handleDeleteClick(participant.id)}
                />
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className={'flex justify-center items-center gap-x-3 w-full mb-3 mt-3'}>
        <button
          className={`bg-gray-500 text-white rounded-md py-1 px-4`}
          disabled={params.page === 1}
          onClick={() => handlePageButtonClick(params.page - 1)}
        >
          &lt;
        </button>
        <p>{params.page} of {noOfPages}</p>
        <button
          className={`bg-gray-500 text-white rounded-md py-1 px-4`}
          onClick={() => handlePageButtonClick(params.page + 1)}
          disabled={params.page === noOfPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CampaignDetail;