'use client'

import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import { Participant } from '@/types/ParticipantTypes';
import { Plan } from '@/types/PlanTypes';
import ClientTablePopup from './ClientTablePopup';
import {useRouter} from "next/navigation";
import FavoriteIcon from "@/components/participants-and-campaigns/FavoriteIcon";

interface ParticipantTableProps {
  participants: Participant[];
  selectedPlan?: Plan | null;
  totalParticipants?: number;
  planId: string | number;
  setParams: Dispatch<SetStateAction<any>>;
  getParams: () => any;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participants,
  selectedPlan,
  totalParticipants,
  planId,
  setParams, getParams
}: ParticipantTableProps) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showClientTablePopup, setShowClientTablePopup] = useState<boolean>(false);
  const selectedPage = getParams().page;
  const router = useRouter();

  const filteredParticipants = selectedPlan
    ? participants?.filter((participant) => participant.planId === selectedPlan.id)
    : participants?.filter((participant) =>
      Object.values(participant).some((value) =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      )
    );

  const calculateSummary = (participants: Participant[]) => {
    const totalParticipants = participants.length;
    const totalBalance = participants.reduce((sum, participant) => sum + (participant.balance || 0), 0);
    const averageAge =
      totalParticipants > 0
        ? participants.reduce((sum, participant) => sum + participant.age, 0) / totalParticipants
        : 0;

    return {
      totalParticipants,
      totalBalance,
      averageAge,
    };
  };

  const summary = calculateSummary(filteredParticipants);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleParticipantSelect = (participant: Participant) => {
    //setSelectedParticipant(participant);
    //setShowClientTablePopup(true);
    router.push(`/advisor/participant-detail?planId=${planId}&participantId=${participant.id}`);
  };

  const getTopStressor = (participant: Participant): string => {
    const { retirement, financial, tax, investment, estate } = participant;

    const stressors = [
      { name: 'Retirement', score: retirement?.toString() },
      { name: 'Financial', score: financial?.toString() },
      { name: 'Tax', score: tax?.toString() },
      { name: 'Investment', score: investment?.toString() },
      { name: 'Estate', score: estate?.toString() },
    ];

    let topStressor = '';
    let highestScore = -1;

    stressors.forEach((stressor) => {
      const { name, score } = stressor;

      const numericScore = parseFloat(score);

      if (!isNaN(numericScore) && numericScore > highestScore) {
        highestScore = numericScore;
        topStressor = name;
      }
    });

    return topStressor;
  };

  const checkScreenWidth = () => {
    setIsMobileView(window.innerWidth < 640); // Adjust breakpoint as needed
  };

  const handlePageButtonClick = (page: number) => {
    setParams?.({ ...getParams?.(), page });
  }

  useEffect(() => {
    window.addEventListener('resize', checkScreenWidth);
    checkScreenWidth();

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const noOfPages: number = Math.ceil((totalParticipants ?? 0) / 10) || 0;

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', color: 'black' }}>
      <div style={{ overflow: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
          <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Participant</th>
            {!isMobileView && <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Advice Score</th>}
            <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Top Interest</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {participants?.map((participant: Participant) => (
            <tr
              key={participant.id}
              style={{ borderBottom: '1px solid #ccc', whiteSpace: 'nowrap' }}
            >
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <div
                  className={'flex justify-center items-center gap-x-2 w-full underline text-navyblue cursor-pointer'}
                  onClick={() => handleParticipantSelect(participant)}
                >
                  {participant.external_id}
                </div>
              </td>
              {!isMobileView && <td style={{ padding: '12px', textAlign: 'center' }}>{participant.advice_score}</td>}
              <td style={{ padding: '12px', textAlign: 'center', fontSize: isMobileView ? '14px' : 'inherit' }}>
                {participant.top_interest}
              </td>
              <td>
                <div className={'flex justify-center'}>
                  <FavoriteIcon width={24} height={24} planId={planId} participantId={participant.id} />
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <div className={'flex justify-center items-center gap-x-3 w-full mb-3 mt-3'}>
          <button
            className={`bg-gray-500 text-white rounded-md py-1 px-4`}
            disabled={selectedPage === 1}
            onClick={() => handlePageButtonClick(selectedPage - 1)}
          >
            &lt;
          </button>
          <p>{selectedPage} of {noOfPages}</p>
          <button
            className={`bg-gray-500 text-white rounded-md py-1 px-4`}
            onClick={() => handlePageButtonClick(selectedPage + 1)}
            disabled={selectedPage === noOfPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {showClientTablePopup && selectedParticipant && (
        <ClientTablePopup
          showChartModal={showClientTablePopup}
          setShowChartModal={setShowClientTablePopup}
          participant={selectedParticipant}
          onClose={() => {
            setShowClientTablePopup(false);
            setSelectedParticipant(null);
          }}
        />
      )}
    </div>
  );
};

export default ParticipantTable;
