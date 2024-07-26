

export interface Politician {
  firstName: string;
  lastName: string;
  party: string;
  state: string;
}

export interface Transaction {
  id: string;
  stockTicker: string;
  stock: string;
  action: string;
  amount: string;
  currency: string;
  traded: Date;
  filed: Date;
  politician: Politician
}

export const mockSenators: Politician[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    party: 'Democrat',
    state: 'California',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    party: 'Republican',
    state: 'Texas',
  },
  // Add more mock data as needed
];

export const mockTransactions: Transaction[] = []

const rawTransactions = [
  {"tx_date":"06/27/2024","file_date":"07/16/2024","last_name":"Whitehouse","first_name":"Sheldon","order_type":"Purchase","ticker":"GS","asset_name":"Goldman Sachs Group, Inc. (The) Common Stock","tx_amount":"$1,001 - $15,000","option_type":null,"strike_price":null,"expiry":null},
  {"tx_date":"06/13/2024","file_date":"07/16/2024","last_name":"Whitehouse","first_name":"Sheldon","order_type":"Purchase","ticker":"HD","asset_name":"Home Depot","tx_amount":"$1,001 - $15,000","option_type":null,"strike_price":null,"expiry":null},
  {"tx_date":"06/13/2024","file_date":"07/16/2024","last_name":"Whitehouse","first_name":"Sheldon","order_type":"Purchase","ticker":"MSFT","asset_name":"Microsoft Corp","tx_amount":"$1,001 - $15,000","option_type":null,"strike_price":null,"expiry":null}
];


console.log(mockSenators);
