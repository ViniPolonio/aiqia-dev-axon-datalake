"use client";

import * as React from "react";
import { Power } from "lucide-react";

import { Button } from "@/components/ui/button";
import { powerButton } from "@/app/services/controlConfig";

import {
    DropdownMenuCheckboxItemProps,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Checked = DropdownMenuCheckboxItemProps["checked"];

interface powerButtonProps {
    active: number;
    id: number;
    onPowerChange: (newActive: number) => void;
}

export function PowerButton({ active, id, onPowerChange }: powerButtonProps) {
    const [showPower, setShowPower] = React.useState<Checked>(false);

    const handlePower = async () => {
        event?.stopPropagation();
        try {
            const newActive = active === 0 ? 1 : 0;
            const response = powerButton(newActive, id);
            onPowerChange(newActive);
        } catch (error) {
            console.error("Erro ao enviar o comando:", error);
        }
    };
    return (
        <Dialog>
            <DialogTrigger onClick={(event) => event.stopPropagation()}>
                <TooltipProvider delayDuration={1000} >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="p-0 h-7 w-7 flex items-center justify-center"
                                name="active"
                            >
                                <Power
                                    className={
                                        active === 0
                                            ? " h-3.5 w-3.5 transition-colors duration-700 hover:text-green-500"
                                            : " h-3.5 w-3.5  transition-colors duration-700 hover:text-red-500"
                                    }
                                />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent >
                            <p>{active === 0 ? "Ligar" : "Desligar"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </DialogTrigger>
            <DialogContent
                onClick={(event) => event.stopPropagation()}
                className="justify-center flex flex-col items-center"
            >
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Tem certeza que deseja{" "}
                        {active === 0 ? "ligar" : "desligar"}?
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter className="justify-center">
                    <DialogClose>
                        <Button
                            className={
                                active === 0
                                    ? " transition-colors duration-700 hover:bg-green-500"
                                    : " transition-colors duration-700 hover:bg-red-500"
                            }
                            onClick={handlePower}
                        >
                            {active === 0 ? "Ligar" : "Desligar"}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
