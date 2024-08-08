"use client"

import ReturnButton from "@/components/botoes/ReturnButton/ReturnButton";
import { CreateTimeForm } from "./CreateTimeForm/CreateTimeForm";

export default function CreateTime() {
    return(
        <main>
            <ReturnButton/>
            <div className=" flex justify-center content-center ">
                <CreateTimeForm/>
            </div>
        </main>
    );
}