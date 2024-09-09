import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import EditTime from "../EditTime/EditTime";
import { useState } from "react";
export type EditTime = {
    id?: number;
    created_at?: Date;
    interval_type?: number;
    interval_value?: number;
    data_type?: number;
    data_value?: number;
    active?: number;
    sync_control_config_id?: number;
};   
export function CardEditTime({ date }: { date: EditTime }) {
    const [open, setOpen] = useState(false);
    console.log(date)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="m-3" asChild>
                <Card className="flex items-center flex-col cursor-pointer">
                    <h1>{date.interval_type === 1 ? "Minuto" : "Hora"}</h1>
                    <h1>
                        {date.interval_value}{" "}
                        {date.interval_type === 1 ? "minuto(s)" : "hora(s)"}
                    </h1>
                </Card>
            </DialogTrigger>
            <DialogContent className="p-0">
                <EditTime data={date} />
            </DialogContent>
        </Dialog>
    );
}
