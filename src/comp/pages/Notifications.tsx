import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '../../@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../../@/components/ui/dropdown-menu"
import { Button } from 'src/@/components/ui/button';
import { Politician } from 'src/interfaces/Senator';
import { useNavigate } from 'react-router-dom';
import { PiEmptyDuotone } from "react-icons/pi";
import { getNotifications } from 'src/firebase';
import { useEffect, useState } from 'react';
import { useToast } from 'src/@/components/ui/use-toast';
import { HiDotsHorizontal } from "react-icons/hi";
import { deleteNotification } from 'src/firebase';
import { LoadingSpinner } from 'src/@/components/ui/loadingSpinner';

  interface DropdownMenuDemoProps {
    politician: Politician;
    onStart: () => void;
    onCompletion: (politician: Politician) => void;
  }
  
  function DropdownMenuDemo({ politician, onStart, onCompletion }: DropdownMenuDemoProps) {
    const deleteRequest = () => {
        onStart()
      deleteNotification(politician)
        .finally(() => {
          onCompletion(politician);
        });
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="py-1">
            <HiDotsHorizontal className="h-5 w-5 p-0 rounded" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black rounded-lg border border-white">
          <DropdownMenuItem className="text-red-400" onClick={deleteRequest}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
  export const Notifications = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState<Politician[]>([]);
    const { toast } = useToast();
    const navigate = useNavigate();
  
    const onPoliticianClick = (politician: Politician) => {
      console.log("ON Politician click");
    };
  
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await getNotifications();
        let notifications: Politician[] = (response.data as { notifications: Politician[] }).notifications;
        setNotifications(notifications);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching transactions, please try again",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchNotifications();
    }, []);
  
    const handleDelete = (politician: Politician) => {
        const updatedNotifiations = notifications.filter((item) => !(item.firstName === politician.firstName && item.lastName === politician.lastName))
        setNotifications(updatedNotifiations)
        setIsLoading(false);
    };
  
    return (
      <div className="container">
        <h1 className="text-2xl m-8 font-bold lg:text-4xl lg:m-12">Keep track of your notifications</h1>
        <p className="text-sm m-8 text-center mx-auto sm:w-4/5 lg:w-2/4 lg:text-base lg:mb-12">
          Whenever any of the politicians you subscribed for files a trade, we will send you an email on the following address.
        </p>
        <div className="md:px-14 relative">
            {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center z-10 h-10'>
                <LoadingSpinner className='size-12 z-10'/>
            </div>)}
            {notifications.length > 0 ? (
            <Table className="bg-zinc-900 rounded-xl max-w-lg mx-auto">
              <TableCaption className="py-8">"A list of your subscribed notifications"</TableCaption>
              <TableHeader>
                <TableRow className="text-gray-500">
                  <TableHead>Politician</TableHead>
                  <TableHead>Excess Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((politician) => (
                  <TableRow className="text-left">
                    <TableCell>
                      <button
                        className="text-left border-b-2 border-transparent transition duration-150 hover:border-yellow-500 px-2 py-1"
                        onClick={() => onPoliticianClick(politician)}
                      >
                        {politician.firstName} {politician.lastName}
                      </button>
                    </TableCell>
                    <TableCell>
                      {/* <DropdownMenuDemo politician={politician} onDelete={handleDelete} /> */}
                    </TableCell>
                    <TableCell>
                      <DropdownMenuDemo politician={politician} onStart={() => {setIsLoading(true)}} onCompletion={handleDelete} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            isLoading ? 
                <div className='absolute inset-0 flex items-center justify-center z-10 h-10'>
                    <LoadingSpinner className='size-12 z-10'/>
                </div> : 
                <div className="flex flex-col mx-auto max-w-lg p-4 items-center mt-36 border rounded-xl border-input bg-background">
                <PiEmptyDuotone className="fill-red-300" size={70}></PiEmptyDuotone>
                <p className="mt-4">
                  You haven't subscribed for the notifications of any politician yet, you can do so in{" "}
                  <span className="underline cursor-pointer" onClick={() => navigate("/")}>
                    Insider Trades
                  </span>{" "}
                  tab
                </p>
              </div>
          )}
        </div>
      </div>
    );
  };
