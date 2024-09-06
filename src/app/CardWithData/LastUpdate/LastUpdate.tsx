import { CardDescription } from "@/components/ui/card";
import React from "react";
interface LastUpdateProps {
    status: number
    date: string;
    className: string;
}

export default function LastUpdate({status, date, className}: LastUpdateProps){
    return (
        <div>
            <CardDescription className="pb-2">
                {status == 2 ? "Criado em: " : "Ultima Atulização: "}
            </CardDescription>
            <h1 className={`${className} text-center text-balance truncate`}>{date}</h1>
        </div>
    );
}