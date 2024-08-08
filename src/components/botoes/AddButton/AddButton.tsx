

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function AddButton() {
    const router = useRouter();
    const handleCreate = () => {
        router.push(`/Create/CreateTable`)
    };
    return(

        <Button title="Create Table" variant="outline" size="icon" onClick={handleCreate}>
          <Plus className="h-[1.2rem] w-[1.2rem] transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
        </Button>
    );
}