"use client";

import ReturnButton from "@/components/botoes/ReturnButton/ReturnButton";
import { CreateTimeForm } from "./CreateControllTime/CreateTimeForm/CreateTimeForm";
import { CreateControllConfigForm } from "./CreateControllConfig/CreateControllConfigForm/CreateTableForm";
import { useEffect, useState } from "react";


export default function Create() {
    const [shouldGetData, setShouldGetData] = useState(false);

    useEffect(() => {
        if (shouldGetData) {
            setShouldGetData(false);
        }
    }, [shouldGetData]);

    return (
        <main>
            <ReturnButton />
            <div className=" flex justify-center content-center ">
                <CreateControllConfigForm
                    onSuccess={() => setShouldGetData(true)}
                />

                <CreateTimeForm shouldGetData={shouldGetData} />
            </div>
        </main>
    );
}
