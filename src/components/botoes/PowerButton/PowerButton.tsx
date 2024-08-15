"use client"

import * as React from "react"
import { Power } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { powerButton } from "@/app/services/configurationTable"

interface powerButtonProps {
    active: number;
    id:number;
    onPowerChange: (newActive: number) => void;
}


export function PowerButton({
    active,
    id,
    onPowerChange, 
}: powerButtonProps) {
    

    const handlePower = async () => {
        try{
            const newActive = active === 0 ? 1 : 0
            const response = powerButton(newActive, id)
            onPowerChange(newActive);
        } catch(error) {
            console.error("Erro ao enviar o comando:", error);
        }
    };
    return(
        <Button 
            title={active === 0 ? "Ligar" : "Desligar"}
            variant="outline" 
            size="icon" 
            onClick={handlePower} 
            className="p-0 h-7 w-7 flex items-center justify-center"
            name="active"
        >
          <Power
            className= {active === 0 ? " h-3.5 w-3.5 transition-colors duration-700 hover:text-green-500" 
                :
                " h-3.5 w-3.5  transition-colors duration-700 hover:text-red-500"
            }
           />
        </Button>
    );
}