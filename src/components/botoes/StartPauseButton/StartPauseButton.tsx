import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface StartPauseButtonProps {
    functionOnClick: () => void;
    className?: string;
    isPlaying: boolean;
}

export default function StartPauseButton({
    functionOnClick,
    className,
    isPlaying,
}: StartPauseButtonProps) {
    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="button_menu"
                        onClick={functionOnClick}
                        type="button"
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p> {isPlaying ? "Pausar Autoplay" : "Iniciar Autoplay"}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}