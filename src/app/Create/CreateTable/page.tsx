"use client"

import ReturnButton from "@/components/botoes/ReturnButton/ReturnButton";
import { CreateTableForm } from "./CreateTableForm/CreateTableForm";

export default function CreateTable() {
    return(
        <main>
            <ReturnButton/>
            <div className=" flex justify-center content-center ">
                <CreateTableForm/>
            </div>
        </main>
    )
}