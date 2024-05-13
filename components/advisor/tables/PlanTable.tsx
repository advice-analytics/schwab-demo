'use client'

import React, { useState, useEffect } from 'react';
import { Plan } from '@/types/PlanTypes';
import { BsArrowUpRightSquare } from "react-icons/bs";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface PlanTableProps {
  plans: Plan[];
}

const PlanTable: React.FC<PlanTableProps> = ({ plans }) => {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const checkScreenWidth = () => {
    setIsMobileView(window.innerWidth < 768); // Adjust breakpoint as needed
  };

  const calculateSummary = (plans: Plan[]) => {
    const totalPlans = plans.length;
    const totalParticipants = plans.reduce((sum, plan) => sum + (plan.participants ? plan.participants.length : 0), 0);
  
    return {
      totalPlans,
      totalParticipants,
    };
  };

  const handlePlanSelect = (plan: Plan) => {
    router.push(`/participants-and-campaigns?planId=${plan.id}`);
  };
  
  const summary = calculateSummary(plans);
  
  useEffect(() => {
    window.addEventListener('resize', checkScreenWidth);
    checkScreenWidth();
  
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const handleHealthClick = (plan: Plan) => {
    router.push(`/plan-health?planId=${plan.id}`);
  }
  
  return (
    <div
      style={{
        maxWidth: '100%',
        overflowX: 'auto',
        color: 'black'
      }}
      className={'mt-5'}
    >
      {/* Display summary information */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#144e74',
        }}
      >
        <h3>Total Plans: {summary.totalPlans}</h3>
      </div>
  
      {/* Table container with horizontal scrollbar */}
      <div
        style={{
          overflowX: 'auto',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        {/* Plan Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          {/* Table header */}
          <thead>
            <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Plan</th>
              {!isMobileView && <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Participants</th>}
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Health</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Select</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan: Plan, index: number) => (
              <tr key={plan.id} style={{ borderBottom: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                <td style={{ padding: '12px', textAlign: 'center' }}>{plan.external_id}</td>
                {!isMobileView && (
                  <td style={{ padding: '12px', textAlign: 'center' }}>{plan.participant_count ?? 0}</td>
                )}
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#144e74',
                    }}
                    onClick={() => handleHealthClick(plan)}
                  >
                    {plan.metrics?.health}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div className={'flex justify-center'}>
                    <button
                      style={{
                        cursor: 'pointer',
                        backgroundColor: '#144e74',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 12px',
                      }}
                      className={'flex items-center gap-x-2'}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      Select
                      <BsArrowUpRightSquare />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanTable;
