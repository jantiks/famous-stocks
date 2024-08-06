import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../@/components/ui/table';

import { Politician, Transaction } from '../interfaces/Senator';
import { SubscribeDialog } from './SubscribeDialog';

interface TransactionTableProps {
  transactions: Transaction[];
  onPoliticianClick: (politician: Politician) => void;
  onTickerClick: (ticker: string) => void;
}

const SenatorTable: React.FC<TransactionTableProps> = ({ transactions, onPoliticianClick, onTickerClick }) => {
  return (
    <Table className='bg-zinc-900 rounded-xl'>
      <TableCaption className='py-8'>{transactions.length > 0 ? "A list of recent senator trades" : "No recent trades available"}</TableCaption>
      <TableHeader>
        <TableRow className='text-gray-500'>
          <TableHead>Stock</TableHead>
          <TableHead>Polititian</TableHead>
          <TableHead>Transaction</TableHead>
          <TableHead>Traded</TableHead>
          <TableHead>Filed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const purchaseClass = transaction.action === "Purchase" ? "text-green-600" : "text-red-600"
          return (
            <TableRow className='text-left' key={transaction.id}>
              <TableCell>
              <button className='text-left border-b-2 border-transparent transition duration-150 hover:border-yellow-500 px-2 py-1' onClick={() => onTickerClick(transaction.stockTicker)}>
                <div className="font-medium">{transaction.stockTicker}</div>
                <div className="font-light text-xs text-gray-500 max-w-52 truncate hidden sm:block">{transaction.stock}</div>
                </button>
              </TableCell>
              <TableCell>
              <button className='text-left border-b-2 border-transparent transition duration-150 hover:border-yellow-500 px-2 py-1' onClick={() => onPoliticianClick(transaction.politician)}>
                {transaction.politician.firstName} {transaction.politician.lastName}
              </button>
                </TableCell>
              <TableCell>
                <div className={purchaseClass}>{transaction.action}</div>
                <div>{transaction.amount}</div>
              </TableCell>
              <TableCell>{transaction.traded.toLocaleString().slice(0, 10)}</TableCell>
              <TableCell>{transaction.filed.toLocaleString().slice(0, 10)}</TableCell>
                <TableCell>
                  <SubscribeDialog politician={transaction.politician}></SubscribeDialog>
                </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SenatorTable;
