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
import { Senator } from '../interfaces/Senator';

interface SenatorTableProps {
  senators: Senator[];
}

const SenatorTable: React.FC<SenatorTableProps> = ({ senators }) => {
  const totalGainLoss = senators.reduce((total, senator) => total + senator.totalGainLoss, 0);

  return (
    <Table className="bg-gray-800 text-white">
      <TableCaption className="text-white">A list of recent senator trades.</TableCaption>
      <TableHeader className="bg-gray-700">
        <TableRow>
          <TableHead className="text-center text-white">Name</TableHead>
          <TableHead className="text-center text-white">Party</TableHead>
          <TableHead className="text-center text-white">State</TableHead>
          <TableHead className="text-center text-white">Total Gain/Loss</TableHead>
          <TableHead className="text-center text-white">Trades</TableHead>
          <TableHead className="text-center text-white">Top Gained Stock</TableHead>
          <TableHead className="text-center text-white">Top Gain</TableHead>
          <TableHead className="text-center text-white">Top Lost Stock</TableHead>
          <TableHead className="text-center text-white">Top Loss</TableHead>
          <TableHead className="text-center text-white">Investment</TableHead>
          <TableHead className="text-center text-white">Ethics Violations</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {senators.map((senator) => (
          <TableRow key={senator.name} className="even:bg-gray-700 odd:bg-gray-600">
            <TableCell className="font-medium text-white">{senator.name}</TableCell>
            <TableCell className="text-white">{senator.party}</TableCell>
            <TableCell className="text-white">{senator.state}</TableCell>
            <TableCell className="text-white">{`$${senator.totalGainLoss.toLocaleString()}`}</TableCell>
            <TableCell className="text-white">{senator.numberOfTrades}</TableCell>
            <TableCell className="text-white">{senator.topGainedStock}</TableCell>
            <TableCell className="text-white">{`$${senator.topGainedAmount.toLocaleString()}`}</TableCell>
            <TableCell className="text-white">{senator.topLostStock}</TableCell>
            <TableCell className="text-white">{`$${senator.topLostAmount.toLocaleString()}`}</TableCell>
            <TableCell className="text-white">{`$${senator.totalInvestment.toLocaleString()}`}</TableCell>
            <TableCell className="text-white">{senator.ethicsViolations}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="bg-gray-700">
        <TableRow>
          <TableCell colSpan={3} className="text-white">Total Gain/Loss</TableCell>
          <TableCell className="text-white">{`$${totalGainLoss.toLocaleString()}`}</TableCell>
          <TableCell colSpan={7}></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default SenatorTable;
