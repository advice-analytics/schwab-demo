import React, {useEffect, useState} from 'react';

import httpService from "@/services/http-service";
import { cellStyle, tableHeaderStyle, tableRowStyle, tableStyle } from "@/constants/table-styles";

interface CampaignsProps {
  planId: string | number;
}

let cachedCampaigns: any = null;

const Index: React.FC<CampaignsProps> = ({ planId }) => {
  const [campaignsData, setCampaigns] = useState<any>({});

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

    if (!cachedCampaigns) {
      fetchCampaigns();
    }
    else {
      setCampaigns(cachedCampaigns);
    }
  }, [planId]);

  return (
    <table style={tableStyle} className={'mt-3'}>
      <thead>
      <tr style={tableHeaderStyle}>
        <th>Name</th>
        <th># On List</th>
        <th>Last Update</th>
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
  );
};

export default Index;