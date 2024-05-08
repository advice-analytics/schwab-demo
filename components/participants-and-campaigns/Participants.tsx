import React, {useEffect, useState} from 'react';

import { Participant } from "@/types/ParticipantTypes";
import ParticipantTable from "@/components/advisor/tables/ParticipantTable";
import httpService from "@/services/http-service";

interface ParticipantsProps {
  planId: string | number;
}

let cachedParticipants: { total_count: number; participants: Participant[] } | null = null;

const Participants: React.FC<ParticipantsProps> = ({ planId }) => {
  const [participantsData, setParticipantsData] = useState<{ total_count: number | undefined; participants: Participant[] | undefined } | undefined>();

  const handleParticipantSearch = async (searchText: string) => {
    const results = cachedParticipants?.participants?.filter((participant: any) => {
      return `${participant.id}`.includes(searchText);
    });
    setParticipantsData({ total_count: participantsData?.total_count, participants: results });
  }

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await httpService.get(`/v1/advisor/plan/${planId}/participants`);
        cachedParticipants = response.data;
        setParticipantsData(response.data);
      }
      catch (error: any) {
        throw new Error(error.toString());
      }
    };

    cachedParticipants ? setParticipantsData(cachedParticipants) : fetchParticipants();
  }, [planId]);

  return (
    <ParticipantTable
      participants={participantsData?.participants ?? []}
      totalParticipants={participantsData?.total_count}
    />
  );
}

export default Participants;