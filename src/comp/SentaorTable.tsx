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
    <Table className='bg-accent'>
      <TableCaption>A list of recent senator trades.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='text-center'>Stock</TableHead>
          <TableHead className='text-center'>Polititian</TableHead>
          <TableHead className='text-center'>Transaction</TableHead>
          <TableHead className='text-center'>Traded</TableHead>
          <TableHead className='text-center'>Filed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              <div className="font-medium">{transaction.stockTicker}</div>
              <div className="font-medium">{transaction.stock}</div>
            </TableCell>
            <TableCell>{transaction.politician.firstName} {transaction.politician.lastName}</TableCell>
            <TableCell>
              <div>{transaction.action}</div>
              <div>{transaction.amount}</div>
            </TableCell>
            <TableCell>{transaction.traded.toLocaleDateString("en-US")}</TableCell>
            <TableCell>{transaction.filed.toLocaleDateString("en-US")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SenatorTable;
