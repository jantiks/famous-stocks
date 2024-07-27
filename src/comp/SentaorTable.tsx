import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../@/components/ui/table';
import { Transaction } from '../interfaces/Senator';

interface TransactionTableProps {
  transactions: Transaction[];
}

const SenatorTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return (
    <Table className='bg-zinc-900 rounded-xl'>
      <TableCaption>A list of recent senator trades.</TableCaption>
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
          // Debug log for each transaction
          const purchaseClass = transaction.action == "Purchase" ? "text-green-600" : "text-red-600"
          return (
            <TableRow className='text-left' key={transaction.id}>
              <TableCell>
                <div className="font-medium">{transaction.stockTicker}</div>
                <div className="font-light text-xs text-gray-500 max-w-52 truncate">{transaction.stock}</div>
              </TableCell>
              <TableCell>{transaction.politician.firstName} {transaction.politician.lastName}</TableCell>
              <TableCell>
                <div className={purchaseClass}>{transaction.action}</div>
                <div>{transaction.amount}</div>
              </TableCell>
              <TableCell>{transaction.traded.toLocaleString()}</TableCell>
              <TableCell>{transaction.traded.toLocaleString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SenatorTable;
