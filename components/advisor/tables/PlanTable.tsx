'use client'

import React, { useState, useEffect } from 'react';
import { Plan } from '@/types/PlanTypes';
import { useRouter } from "next/navigation";
import {getNumInCommaFormat} from "@/utilities/utils";

interface PlanTableProps {
  plans: Plan[];
  totalAssets: string;
}

const PlanTable: React.FC<PlanTableProps> = ({ plans, totalAssets }) => {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const checkScreenWidth = () => {
    setIsMobileView(window.innerWidth < 768); // Adjust breakpoint as needed
  };

  const handlePlanSelect = (plan: Plan) => {
    router.push(`/participants-and-campaigns?planId=${plan.id}`);
  };
  
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
          <tr style={{backgroundColor: '#144e74', color: 'white', textAlign: 'center'}}>
            <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Plan</th>
            {!isMobileView && <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Total Assets</th>}
            <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Participants</th>
            {!isMobileView && (
              <th style={{padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap'}}>Health</th>
            )}
          </tr>
          </thead>
          <tbody>
          {plans.map((plan: Plan, index: number) => (
            <tr key={plan.id} style={{borderBottom: '1px solid #ccc', whiteSpace: 'nowrap'}}>
              <td style={{padding: '12px', textAlign: 'center'}}>
                <p
                  className={'cursor-pointer inline-block underline text-navyblue text-sm'}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.external_id}
                </p>
              </td>
              {!isMobileView && (
                <td
                  style={{ padding: '12px', textAlign: 'center', color: 'green' }}
                  className={'text-sm'}
                >
                  {totalAssets}
                </td>
              )}
              <td
                style={{ padding: '12px', textAlign: 'center' }}
                className={'text-sm text-navyblue'}
              >
                {getNumInCommaFormat(plan.participant_count ?? 0)}
              </td>
              {!isMobileView && (
                <td
                  style={{padding: '12px', textAlign: 'center'}}
                  className={'text-sm'}
                >
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
              )}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanTable;
