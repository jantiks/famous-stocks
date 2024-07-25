import React from 'react';
import SenatorTable from './SentaorTable';
import { mockTransactions } from '../interfaces/Senator';

const SenateListing: React.FC = () => {
  return (
    <div className='contaier'>
      <SenatorTable transactions={mockTransactions} />
    </div>
  );
};

export default SenateListing;