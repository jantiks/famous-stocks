import React from 'react';
import SenatorTable from './SentaorTable';
import { Transaction } from '../interfaces/Senator';
import { useEffect, useState } from 'react';
import { getTransactions } from 'src/firebase';


const SenateListing: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchTransactions = async () => {
    console.log("ASD USEEFFECT")
      try {
        const result = await getTransactions();
        const data: Transaction[] = result.data as Transaction[];
        setTransactions(data);
      } catch (error) {
        console.log("ASD ERROR FETCH", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className='container'>
      <SenatorTable transactions={transactions} />
    </div>
  );
};

export default SenateListing;