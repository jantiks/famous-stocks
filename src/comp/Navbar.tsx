import React from 'react'
import { useMediaQuery } from 'src/hooks/use-media-query';
import { Drawer, DrawerContent, DrawerTrigger } from 'src/@/components/ui/drawer';
import { MenuIcon } from 'lucide-react';


export const Navbar: React.FC = () => {
    const reloadApp = () => {
        window.location.href = "/";
        window.location.reload();
      };

    const isDesktop = useMediaQuery("(min-width: 768px)")
    
    return (
      <nav className="bg-zinc-800 text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            {/* Replace with your logo image or text */}
            <button onClick={() => {reloadApp()}}>
                <img src="logo.png" alt="Logo" className="h-10 mr-3" />
            </button>
          </div>
          {isDesktop ? (
            <>
              <div className="flex space-x-4 font-medium">
                <a href="#trades" className="border-b-2 border-transparent transition duration-150 hover:border-b-white">
                  Insider Trades
                </a>
                <a href="#notifications" className="border-b-2 border-transparent transition duration-150 hover:border-b-white">
                  Notifications
                </a>
                <a href="#login" className="border-b-2 border-transparent transition duration-150 hover:border-b-white">
                  Login
                </a>
              </div>
            </>
          ) : (
          <>
            <Drawer direction='right'>
              <DrawerTrigger>
                <MenuIcon />
              </DrawerTrigger>
              <DrawerContent className='bg-zinc-800 bg-opacity-60'>
              <div className="font-medium mt-12">
                <a href="#trades" className="block p-2 text-center transition duration-150 hover:bg-white hover:text-black">
                  Insider Trades
                </a>
                <a href="#notifications" className="block p-2 text-center transition duration-150 hover:bg-white hover:text-black">
                  Notifications
                </a>
                <a href="#login" className="block p-2 text-center  transition duration-150 hover:bg-white hover:text-black">
                  Login
                </a>
              </div>
              </DrawerContent>
            </Drawer>
          
          </>)}
        </div>
      </nav>
    );
  };
  
  // Optional: Default export if needed
  export default Navbar;