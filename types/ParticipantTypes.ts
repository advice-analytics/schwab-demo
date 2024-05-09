// ParticipantTypes.ts

// Define the Score interface
export interface Score {
  category: string;
  score: number;
}

// Define the Participant interface
export interface Participant {
  id: string;
  name: string;
  balance: number;
  age: number;
  state: string;
  maritalStatus: string;
  hasBalance?: number;
  glidePath?: string;
  planReturns?: string;
  savingsRatePercent?: number;
  gender?: string;
  salary?: number;
  retirement: number;   // Add retirement property
  financial: number;    // Add financial property
  tax: number;          // Add tax property
  investment: number;   // Add investment property
  estate: number;       // Add estate property
  planId: string;
  planName: string; // Add planName property  // Add planId property
  advice_score: string;
  scores: {
    [key: string]: number;
  };
  clients?: Client[];
  top_interest: string;
  external_id: string;
  is_favorite: boolean;
}

// Define the Client interface as a subtype of Participant
export interface Client extends Participant {}

// Define the ParticipantWithScores interface
export interface ParticipantWithScores extends Participant {
  scores: {
    [key: string]: number;
  };
}
