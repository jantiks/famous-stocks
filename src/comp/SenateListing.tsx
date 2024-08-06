import React from 'react';
import SenatorTable from './SentaorTable';
import { Politician, Transaction } from '../interfaces/Senator';
import { useEffect, useState } from 'react';
import { getTransactions } from 'src/firebase';
import { LoadingSpinner } from 'src/@/components/ui/loadingSpinner';
import { Input } from 'src/@/components/ui/input';
import { Button } from 'src/@/components/ui/button';
import { useToast } from 'src/@/components/ui/use-toast';


const SenateListing: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [ticker, setTicker] = useState<string>('');
  const [politician, setPolitician] = useState<string>('');
  const { toast } = useToast()

  const fetchTransactions = async (firstName: string = "", lastName: string = "", ticker: string = "") => {
    try {
      const result = await getTransactions({ firstName, lastName, ticker });
      const data: Transaction[] = result.data as Transaction[];
      return data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setLoading(true)
    fetchTransactions()
      .then((transactions) => {
        setTransactions(transactions);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: `Error fetching transactions, please try again`
        })
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
      setTransactions(transactions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error filtering transactions, please try again`
      })
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
      toast({
        variant: "destructive",
        title: `Error filtering transactions, please try again`
      })
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    const [firstName, lastName] = politician.split(" ");
    try {
      const transactions = await fetchTransactions(firstName || "", lastName || "", ticker);
      setTransactions(transactions);
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Error searching, please try again`
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='flex flex-col mb-10 sm:space-x-5  sm:flex-row'>
        <div className="mb-10 flex flex-col space-y-5 sm:mb-0 sm:space-x-5 sm:w-96 sm:flex-row sm:space-y-0">
          <Input
            type='text'
            placeholder='Ticker'
            className='bg-zinc-900 placeholder-gray-500 rounded-[6px]'
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
          <Input
            type='text'
            placeholder='Politician'
            className='bg-zinc-900 placeholder-gray-500 rounded-[6px]'
            value={politician}
            onChange={(e) => setPolitician(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className='bg-white text-black rounded-[6px] hover:bg-zinc-500 hover:text-white'
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      <div className='relative'>
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center z-10 h-10'>
            <LoadingSpinner className='size-12 z-10'/>
          </div>
        )}
        <SenatorTable
          transactions={transactions}
          onPoliticianClick={(politician) => filterPolitician(politician)}
          onTickerClick={(ticker) => filterTicker(ticker)}
        />
      </div>
    </div>
  );
};

export default SenateListing;