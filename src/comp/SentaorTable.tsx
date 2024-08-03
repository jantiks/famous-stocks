import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../@/components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../@/components/ui/dialog"
import { Input } from "../@/components/ui/input"
import { Label } from "../@/components/ui/label"
import { Politician, Transaction } from '../interfaces/Senator';
import { Button } from 'src/@/components/ui/button';
import { subscribeForNotifications } from 'src/firebase';
import { useToast } from 'src/@/components/ui/use-toast';

interface TransactionTableProps {
  transactions: Transaction[];
  onPoliticianClick: (politician: Politician) => void;
  onTickerClick: (ticker: string) => void;
}

const SenatorTable: React.FC<TransactionTableProps> = ({ transactions, onPoliticianClick, onTickerClick }) => {

  const DialogDemo = (politician: Politician) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast()
    let emailText = ""

    const handleSubmit = async (politician: Politician, email: string) => {
      try {
        const response = await subscribeForNotifications({firstName: politician.firstName, lastName: politician.lastName, email: email})
        toast({
          title: "Subscribed successfully"
        })
        setOpen(false)
        console.log('Response:', response);
      } catch (error: any) {
        if (error && error.message && error.message == "aborted") {
          toast({
            variant: "destructive",
            title: `You are already subscribed to ${politician.firstName} ${politician.lastName}`
          })
        } else {
          toast({
            variant: "destructive",
            title: "Please try again"
          })
        }
        setOpen(false)
        console.error('Error subscribing for notifications:', error.message);
      }
    };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    className="lucide lucide-bell-ring hover:stroke-yellow-200 transition-colors duration-300">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                      <path d="M4 2C2.8 3.7 2 5.7 2 8"/>
                      <path d="M22 8c0-2.3-.8-4.3-2-6"/>
                  </svg>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-black">
          <DialogHeader>
            <DialogDescription>
              Enter your email to subscribe for buy and sell actions of {politician.firstName} {politician.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" placeholder='Enter your email' className="col-span-3" onChange={(event) => emailText = event.target.value}/>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => handleSubmit(politician, emailText)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }


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
                  {DialogDemo(transaction.politician)}
                </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default SenatorTable;
