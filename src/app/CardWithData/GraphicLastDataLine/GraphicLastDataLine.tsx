"use client"

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { format } from "date-fns";


interface GraphicLastDataLineProps {
    logs?: Array<{ finished_at: string; runtime_second: number }>;
    success: number;
    active: number;
}

                

export function GraphicLastDataLine({
    logs,
    success,
    active: initialActive,
}: GraphicLastDataLineProps) {
    const [active, setActive] = React.useState(initialActive);
    React.useEffect(() => {
        setActive(initialActive);
    }, [initialActive]);

    const color =
        active === 0
            ? "#4B5563"
            : success === 0
            ? "#EF4444"
            : success === 1
            ? "#22C55E"
            : "#CA8A04";
    const chartData =
        logs && logs.length > 0
            ? logs.map((log) => ({
                  x: format(new Date(log.finished_at), "yyyy-MM-dd HH:mm:ss"),
                  executionTime: parseFloat(log.runtime_second.toFixed(0)),
              }))
            : Array.from({ length: 20 }, (_, i) => ({
                  x: new Date(
                      Date.now() - Math.random() * 1000000000
                  ).toISOString(),
                  executionTime: Math.floor(Math.random() * 100) + 1,
              }));

    const chartConfig = {
        desktop: {
            label: "y",
            color: color,
        },
    } satisfies ChartConfig;
    return (
        <ChartContainer
            config={chartConfig}
        className={`mt-1 mb-0 pb-0 cursor-pointer`}
        >
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                    top: 25,
                    left: 15,
                    right: 15,
                    bottom: 20,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="x"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    hide={true}
                />
                {logs && logs.length > 0 && (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" />}
                    />
                )}

                <Line
                    dataKey="executionTime"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={{
                        fill: "var(--color-desktop)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                    isAnimationActive={true}
                    width={10}
                    height={10}
                >
                    <LabelList
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={14}
                    />
                </Line>
            </LineChart>
        </ChartContainer>
    );
}


