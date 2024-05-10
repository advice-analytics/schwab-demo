import React, {useEffect, useState} from 'react';

import { Participant } from "@/types/ParticipantTypes";
import ParticipantTable from "@/components/advisor/tables/ParticipantTable";
import httpService from "@/services/http-service";
import Search from "@/components/common/Search";

interface ParticipantsProps {
  planId: string | number;
}

const Participants: React.FC<ParticipantsProps> = ({ planId }) => {
  const [participantsData, setParticipantsData] = useState<{
    total_count: number | undefined; participants: Participant[] | undefined
  } | undefined>();
  const [params, setParams] = useState<{
    search: string;
    page_size: number;
    page: number;
  }>({
    search: '',
    page_size: 10,
    page: 1
  });

  const handleSearch = async (search: string) => {
    setParams({ ...params, search, page: 1 });
  }

  const getParams = () => params;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await httpService.get(`/v1/advisor/plan/${planId}/participants?page=${params.page}&page_size=${params.page_size}&search=${params.search}`);
        console.log(response.data)
        setParticipantsData(response.data);
      }
      catch (error: any) {
        throw new Error(error.toString());
      }
    };

    fetchParticipants();
  }, [planId, params]);

  return (
    <div className={'flex flex-col gap-y-5 mt-3'}>
      <Search handleSearch={handleSearch} />
      <ParticipantTable
        participants={participantsData?.participants ?? []}
        totalParticipants={participantsData?.total_count}
        planId={planId}
        setParams={setParams}
        getParams={getParams}
      />
    </div>
  );
}

export default Participants;