

import * as React from "react"
import { Hourglass } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function TimeButton() {
    const router = useRouter();
    const handleCreate = () => {
        router.push(`/Create/CreateTime`)
    };
    return(
        <Button title="Create Time" variant="outline" size="icon" onClick={handleCreate}>
          <Hourglass className="h-[1.2rem] w-[1.2rem] transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
        </Button>
    );
}