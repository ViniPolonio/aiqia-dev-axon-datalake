"use client"

import ReturnButton from "@/components/botoes/ReturnButton/ReturnButton";
import EditForm from "../EditForm";


export default function Edit() {

    return (
        <main className="max-h-screen overflow-y-auto">
            <div>
                <ReturnButton />
            </div>
            <div className="flex justify-center">
                <EditForm />
            </div>
        </main>
    );
}