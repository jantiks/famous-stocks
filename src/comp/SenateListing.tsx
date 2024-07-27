import React from 'react';
import SenatorTable from './SentaorTable';
import { Politician, Transaction } from '../interfaces/Senator';
import { useEffect, useState } from 'react';
import { getTransactions } from 'src/firebase';
import { LoadingSpinner } from 'src/@/components/ui/loadingSpinner';


const SenateListing: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async (firstName: string = "", lastName: string = "", ticker: string = "") => {
    try {
      const result = await getTransactions({ firstName, lastName, ticker });
      const data: Transaction[] = result.data as Transaction[];
      return data;
    } catch (error) {
      console.log("ASD ERROR FETCH", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions()
      .then((transactions) => {
        setTransactions(transactions);
      })
      .catch((error) => {
        console.log("ASD ERROR", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filterPolitician = async (politician: Politician) => {
    console.log("FILTER POLITICIAN", politician)
    try {
      setLoading(true);
      const transactions = await fetchTransactions(politician.firstName, politician.lastName);
      console.log("ASD TRANSACTIONS", transactions)
      setTransactions(transactions);
    } catch (error) {
      console.log("ASD ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTicker = async (ticker: string) => {
    try {
      setLoading(true);
      const transactions = await fetchTransactions("", "", ticker);
      setTransactions(transactions);
    } catch (error) {
      console.log("ASD ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='relative'>
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center z-10 h-10'>
            <LoadingSpinner className='size-12 z-10'/>
          </div>
        )}
        <SenatorTable transactions={transactions}
                      onPoliticianClick={ (politician) => filterPolitician(politician)} 
                      onTickerClick={(ticker) => filterTicker(ticker)}
        />
      </div>
    </div>
  );
};

export default SenateListing;