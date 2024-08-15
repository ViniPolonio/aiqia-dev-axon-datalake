"use client"

import ReturnButton from "@/components/botoes/ReturnButton/ReturnButton";
import EditForm from "../EditForm";


export default function Edit() {

    return (
        <main className="">
            <div>
                <ReturnButton/>
            </div>
            <div className="flex justify-center">
                <EditForm/>
            </div>
        </main>
    );
}