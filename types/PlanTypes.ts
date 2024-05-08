// PlanTypes.ts

import { Participant } from "./ParticipantTypes";

export interface Plan {
  participant_count: number;
  id: string; 
  planName: string;
  balance: string;
  participants: Participant[];
  metrics: {
    health: string;
  }
}


export interface Client {
  name: string;
  retirement: number;
  financial: number;
  tax: number;
  investment: number;
  estate: number;
}
