import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
  } from "../@/components/ui/dialog"
import { Button } from "src/@/components/ui/button"
import { auth } from "src/firebase"


export const SignOutDialogContent = () => {

    const handleSignOut = () => {
        auth.signOut()
        .then(() => {
            console.log("ASD HANDLE NAVIGATION")
        })
    }

    return (
        <DialogContent className="sm:max-w-[425px] bg-black">
          <DialogHeader>
            <DialogTitle>
            Are you sure, you want to sign out?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                Close
                </Button>
            </DialogClose>
            <Button type="submit" variant="outline" onClick={() => handleSignOut()}>Sign Out</Button>
          </DialogFooter>
        </DialogContent>
)
}
