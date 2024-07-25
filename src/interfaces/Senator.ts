import { randomUUID, UUID } from "crypto";

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
  transactions: Transaction[];
}

export interface Transaction {
  id: string
  stockTicker: string
  stock: string;
  action: string;
  lowerAmount: number;
  upperAmount: number;
  currency: string;
  politician: Senator
  traded: Date;
  filed: Date;
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
    transactions: []
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
    transactions: []
  },
  // Add more mock data as needed
];

export const mockTransactions: Transaction[] = [
  {
    id: "asdzxc",
    stockTicker: "AAPL",
    stock: "Apple",
    action: "buy",
    lowerAmount: 12000,
    upperAmount: 15000,
    currency: "USD",
    politician: mockSenators[0],
    traded: new Date(),
    filed: new Date()
  },

  {
    id: "zxcasd",
    stockTicker: "MSFT",
    stock: "Microsoft",
    action: "sell",
    lowerAmount: 7340,
    upperAmount: 34000,
    currency: "USD",
    politician: mockSenators[1],
    traded: new Date(),
    filed: new Date()
  }
];