"use client"

import ReturnButton from "@/components/botoes/ReturnButton/ReturnButton";
import DataTableIndicadores from "../DataTableIndicadores";


export default function Historic() {
    return (
        <main className="">
            <div>
                <ReturnButton/>
            </div>
            <div className="flex w-2/3 justify-center">
                <DataTableIndicadores/> {/* passar o json como parametro */}
            </div>
        </main>
    );
}