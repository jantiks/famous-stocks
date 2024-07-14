export interface Senator {
  name: string;
  party: string;
  state: string;
  totalGainLoss: number;
  numberOfTrades: number;
  topGainedStock: string;
  topGainedAmount: number;
  topLostStock: string;
  topLostAmount: number;
  totalInvestment: number;
  ethicsViolations: number;
}

export const mockSenators: Senator[] = [
  {
    name: 'John Doe',
    party: 'Democrat',
    state: 'California',
    totalGainLoss: 250000,
    numberOfTrades: 35,
    topGainedStock: 'Apple Inc.',
    topGainedAmount: 150000,
    topLostStock: 'Tesla Inc.',
    topLostAmount: 50000,
    totalInvestment: 1200000,
    ethicsViolations: 0,
  },
  {
    name: 'Jane Smith',
    party: 'Republican',
    state: 'Texas',
    totalGainLoss: 100000,
    numberOfTrades: 20,
    topGainedStock: 'Microsoft Corp.',
    topGainedAmount: 80000,
    topLostStock: 'Amazon Inc.',
    topLostAmount: 30000,
    totalInvestment: 900000,
    ethicsViolations: 1,
  },
  // Add more mock data as needed
];