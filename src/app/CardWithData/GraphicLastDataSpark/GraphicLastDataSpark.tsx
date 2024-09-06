import { Card, Tracker, type Color } from "@tremor/react";
import { log } from "console";
import { formatDate } from "date-fns";
import { format } from "path";
import React from "react";
import { GraphicalItem } from "recharts/types/chart/generateCategoricalChart";
import { string } from "zod";

interface TrackerProps {
    success: number;
    active?: number;
    logs: Array<{ finished_at: string; success: number; status: number }>;
}

// const data: Tracker[] = [
//     { color: "rose", tooltip: "Downtime" },
//     { color: "emerald", tooltip: "Operational" },
//     { color: "emerald", tooltip: "Operational" },
//     { color: "rose", tooltip: "Downtime" },
//     { color: "emerald", tooltip: "Operational" },
//     { color: "emerald", tooltip: "Operational" },
//     { color: "rose", tooltip: "Downtime" },
//     { color: "emerald", tooltip: "Operational" },
//     { color: "yellow", tooltip: "Operational" },
// ];


export function GraphicLastDataSpark({
    logs,
    success,
    active: initialActive,
}: TrackerProps) {
    const [active, setActive] = React.useState(initialActive);

    React.useEffect(() => {
        setActive(initialActive);
    }, [initialActive]);

    const color = (active: number = 0, success: number): string => {
        if (active === 0) {
            switch (success) {
                case 0:
                    return "zinc";
                case 1:
                    return "slate";
                default:
                    return "black";
            }
        } else {
            switch (success) {
                case 0:
                    return "rose";
                case 1:
                    return "emerald";
                default:
                    return "yellow";
        }}
    }
    const logsComSuccess = logs.map((log) => ({
        ...log,
        success: log.status ?? log.success,
    }));

    const paddedLogs =
        logsComSuccess.length < 10
            ? logsComSuccess.concat(
                  Array(20 - logs.length).fill({ success: 2, finished_at: "" })
              )
            : logsComSuccess;

    const colors = {
        0: "rose",
        1: "emerald",
        2: "yellow", // Cor para "unsyncronized"
    };
    const data = paddedLogs.map((log) => ({
        tooltip:
            log.success === 2
                ? "Unsyncronized"
                : formatDate(new Date(log.finished_at), "dd/MM/yyyy HH:mm:ss"),
        color: color(active, (log.success)),
    }));
    
    return (
        <div className="h-2/3">
            <Tracker data={data} className="mt-2"  />
        </div>
    );
}


