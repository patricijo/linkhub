import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>This is a description inside the dialog.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>Open the dialog</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
