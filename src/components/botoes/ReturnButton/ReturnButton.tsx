import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from 'framer-motion';


export default function ReturnButton() {
    const router = useRouter();
    const handleReturn = () => {
        router.push(`/`);
    }
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    
                    <Button
                        onClick={handleReturn}
                        variant="outline"
                        size="icon"
                        
                        className="button_menu ml-3 mt-3 hover:cursor-magnet"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="ml-3">
                    <p>Voltar ao menu</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}