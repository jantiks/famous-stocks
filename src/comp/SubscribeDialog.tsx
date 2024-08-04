import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from '../@/components/ui/dialog';
import { Politician } from '../interfaces/Senator';
import { Button } from 'src/@/components/ui/button';
import { subscribeForNotifications } from 'src/firebase';
import { useToast } from 'src/@/components/ui/use-toast';

interface SubscribeDialogProps {
  politician: Politician;
}

export const SubscribeDialog: React.FC<SubscribeDialogProps> = ({ politician }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const response = await subscribeForNotifications({
        firstName: politician.firstName,
        lastName: politician.lastName,
        email: email,
      });
      toast({
        title: 'Subscribed successfully',
      });
      setOpen(false);
      console.log('Response:', response);
    } catch (error: any) {
      if (error && error.message && error.message === 'aborted') {
        toast({
          variant: 'destructive',
          title: `You are already subscribed to ${politician.firstName} ${politician.lastName}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Please try again',
        });
      }
      setOpen(false);
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
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bell-ring transition-colors duration-300"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            <path d="M4 2C2.8 3.7 2 5.7 2 8" />
            <path d="M22 8c0-2.3-.8-4.3-2-6" />
          </svg>
        </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-black">
        <DialogHeader>
            <DialogTitle>
            Subscribe for notification
            </DialogTitle>
            <DialogDescription>
            You will subscribe for all buy and sell actions of {politician.firstName} {politician.lastName}
            </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" type="submit" onClick={() => handleSubmit()}>Submit</Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};
