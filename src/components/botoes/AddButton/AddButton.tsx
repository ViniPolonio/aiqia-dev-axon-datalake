

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function AddButton() {
    const router = useRouter();
    const handleCreate = () => {
        router.push(`/Create`)
    };
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCreate}
                        className="button_menu"
                    >
                        <Plus className="h-[1.2rem] w-[1.2rem] transition-all dark:scale-100 text-black dark:text-white" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Create Process</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}