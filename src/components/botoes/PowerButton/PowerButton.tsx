

import * as React from "react"
import { Power } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function PowerButton() {
    const router = useRouter();
    const handlePower = () => {
        console.log("segredo")
        // funcao de desligar
    };
    return(
        <Button 
            title="Edit" 
            variant="outline" 
            size="icon" onClick={handlePower} 
            className="p-0 h-7 w-7 flex items-center justify-center"
        >
          <Power className=" h-3.5 w-3.5 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white" />
        </Button>
    );
}