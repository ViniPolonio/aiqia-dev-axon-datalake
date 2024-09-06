import { CardDescription } from "@/components/ui/card";
import { EllipsisIcon } from "lucide-react";
import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
interface IntervalorSincronizacaoProps {
    // intervaloSincronizacao: Array<string>;
    intervaloSincronizacao: string;
    className?: string;
}

export default function IntervalorSincronizacao({
    intervaloSincronizacao,
    className,
}: IntervalorSincronizacaoProps) {
    return (
        <div>
            <CardDescription
                className={`${className} pb-2`}
            >
                {"Intervalo entre Sincronizações:"}
            </CardDescription>
            {/* <div className="flex justify-evenly truncate">
                {intervaloSincronizacao.length > 4 ? (
                    <>
                        {intervaloSincronizacao
                            .slice(0, 3)
                            .map((item, index) => (
                                <h1
                                    key={index}
                                    className={`${className} text-center text-balance truncate`}
                                >
                                    {item}
                                </h1>
                            ))}
                        <TooltipProvider delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <EllipsisIcon />
                                </TooltipTrigger>
                                <TooltipContent className="ml-3">
                                    <ul>
                                        {intervaloSincronizacao
                                            .slice(3)
                                            .map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                ) : (
                    intervaloSincronizacao.map((item, index) => (
                        <h1
                            key={index}
                            className={`${className} text-center text-balance truncate`}
                        >
                            {item}
                        </h1>
                    ))
                )}
            </div> */}
            <div className="flex justify-evenly truncate">
                <h1
                    className={`${className} text-center text-balance truncate`}
                >
                    {intervaloSincronizacao}
                </h1>
            </div>
        </div>
    );
}
