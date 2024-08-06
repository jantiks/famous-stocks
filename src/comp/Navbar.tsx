import { useState } from 'react';
import { useMediaQuery } from 'src/hooks/use-media-query';
import { Drawer, DrawerContent, DrawerTrigger } from 'src/@/components/ui/drawer';
import { MenuIcon } from 'lucide-react';
import { cn } from 'src/@/lib/utils';
import { Dialog, DialogTrigger } from 'src/@/components/ui/dialog';
import { SignInDialogContent } from './SignInDialogContent';
import { SignOutDialogContent } from './SignOutDialogContent';
import { useAuth } from 'src/auth/authContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Determine the selected tab based on the current route
  const selectedTab = location.pathname.includes("/notifications")
    ? "notifications"
    : "trades";

  const reloadApp = () => {
    navigate("/")
  };

  const selectedClass = isDesktop ? "border-b-white" : "bg-white text-black";

  return (
    <nav className="bg-zinc-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={reloadApp}>
            <img src="logo.png" alt="Logo" className="h-10 mr-3" />
          </button>
        </div>
        {isDesktop ? (
          <div className="flex space-x-4 font-medium">
            <button
              onClick={() => navigate("/")}
              className={cn(
                "border-b-2 border-transparent transition duration-150 hover:border-b-white",
                selectedTab === "trades" ? selectedClass : ""
              )}
            >
              Insider Trades
            </button>
            {userLoggedIn && (
              <button
                onClick={() => navigate("/notifications")}
                className={cn(
                  "border-b-2 border-transparent transition duration-150 hover:border-b-white",
                  selectedTab === "notifications" ? selectedClass : ""
                )}
              >
                Notifications
              </button>
            )}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <button className="border-b-2 border-transparent transition duration-150 hover:border-b-white">
                  {userLoggedIn ? "Sign Out" : "Sign In"}
                </button>
              </DialogTrigger>
              {userLoggedIn ? (
                <SignOutDialogContent completion={() => {setOpenDialog(false)}}></SignOutDialogContent>
              ) : (
                <SignInDialogContent completion={() => {setOpenDialog(false)}}></SignInDialogContent>
              )}
            </Dialog>
          </div>
        ) : (
          <Drawer direction="right">
            <DrawerTrigger>
              <MenuIcon />
            </DrawerTrigger>
            <DrawerContent className="bg-zinc-800 bg-opacity-60">
              <div className="font-medium mt-12">
                <button
                  onClick={() => navigate("/")}
                  className={cn(
                    "block w-full p-2 text-center transition duration-150 hover:bg-white hover:text-black",
                    selectedTab === "trades" ? selectedClass : ""
                  )}
                >
                  Insider Trades
                </button>
                {userLoggedIn && (
                  <button
                    onClick={() => navigate("/notifications")}
                    className={cn(
                      "block w-full p-2 text-center transition duration-150 hover:bg-white hover:text-black",
                      selectedTab === "notifications" ? selectedClass : ""
                    )}
                  >
                    Notifications
                  </button>
                )}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <button className="block w-full p-2 text-center transition duration-150 hover:bg-white hover:text-black">
                      {userLoggedIn ? "Sign Out" : "Sign In"}
                    </button>
                  </DialogTrigger>
                  {userLoggedIn ? (
                    <SignOutDialogContent completion={() => {setOpenDialog(false)}}></SignOutDialogContent>
                  ) : (
                    <SignInDialogContent completion={() => {
                      setOpenDialog(false)
                      reloadApp();
                    }}></SignInDialogContent>
                  )}
                </Dialog>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </nav>
  );
};

export default Navbar;