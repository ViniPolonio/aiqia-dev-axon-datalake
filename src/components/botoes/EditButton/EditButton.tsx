"use client"

import * as React from "react"
import { PencilIcon, Plus } from "lucide-react"

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

interface EditButtonProps{
  id: number,
}

export function EditButton({
  id
}: EditButtonProps) {
    const router = useRouter();
    const handleEdit = () => {
        router.push(`/edit/${id}`)
    };
    return (

        
        <TooltipProvider delayDuration={1000}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                            handleEdit();
                            e.stopPropagation();
                        }}
                        className="p-0 h-7 w-7 flex items-center justify-center"
                    >
                        <PencilIcon className=" h-3.5 w-3.5 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="ml-3">
                    <p>Editar</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}