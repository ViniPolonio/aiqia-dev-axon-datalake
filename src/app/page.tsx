"use client";

import { CardWithData } from "./CardWithData/CardWithData";
import React, { useCallback, useEffect, useState } from "react";
import { SearchAndFilter } from "./SearchAndFilter/SearchAndFilter";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { AddButton } from "@/components/botoes/AddButton/AddButton";
import { getControlConfig } from "@/app/services/controlConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { PauseIcon, PlayIcon } from "lucide-react";
import StartPauseButton from "@/components/botoes/StartPauseButton/StartPauseButton";

interface TimeConfigs {
    value: number;
    status: string;
}

export type Data = {
    id: number;
    process_name: string;
    active: number;
    status: number;
    interval_description: Array<string>;
    created_at: Date;
    finished_at: Date;
    lastLogs: Array<any>;
    timeConfigs: Array<TimeConfigs>
};
export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState<Array<Data>>([]);
    const [loading, setLoading] = useState(true);

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true, playOnInit: false })
    );
    const [isPlaying, setIsPlaying] = useState(false);

    const fetchData = async (nextCursor = null) => {
        setLoading(true);
        try {
            const request = await getControlConfig();
            if (request.status === 200) {
                const response = request.data;
                const data = response.data;

                const configTables = data.map((item: any) => {
                   const timeConfigs = [
                       item.config_data.intervals.interval_in_minutes,
                       item.config_data.intervals.interval_in_hours,
                       item.config_data.intervals.interval_in_days,
                   ];
                   console.log(timeConfigs);
                    const status =
                        timeConfigs.some((row: any[]) =>
                            row.some(
                                (timeConfig: any) =>
                                    timeConfig.status === 'inactive' &&
                                    timeConfig.value !== 0
                            )
                        ) ||
                        timeConfigs.every((row: any[]) =>
                            row.every(
                                (timeConfig: any) => timeConfig.value === 0
                            )
                        )
                            ? 3
                            : item.logs && item.logs.length > 0
                            ? item.logs[0].success
                            : 2;

                
                    return {
                        id: item.config_data.id,
                        process_name: item.config_data.process_name,
                        active: item.config_data.active,
                        timeConfigs: timeConfigs,
                        status: status,
                        created_at: new Date(item.config_data.created_at),
                        finished_at:
                            item.logs === null
                                ? new Date(0)
                                : new Date(item.logs[0].finished_at),
                        lastLogs: item.logs === null ? [] : item.logs,
                        interval_description: timeConfigs,
                    };
                   
                });
                
                
                setData((prevData) => {
                    const combinedData = [...prevData];

                    configTables.forEach((newItem: Data) => {
                        const exists = combinedData.some(
                            (item) => item.id === newItem.id
                        );
                        if (!exists) {
                            combinedData.push(newItem);
                        }
                    });

                    return combinedData;
                });
                
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter((item) =>
        item.process_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleAutoplay = useCallback(() => {
        const autoplay = plugin.current;
        if (!autoplay) return;

        if (autoplay.isPlaying()) {
            autoplay.stop();
            setIsPlaying(false);
        } else {
            autoplay.play();
            setIsPlaying(true);
            
        }
    }, []);

    const chanceButtonState = () => {
        const autoplay = plugin.current;
        if (!autoplay) return;


        if (autoplay.isPlaying()) {
            setIsPlaying(false);
            autoplay.stop();
        }
    };

    return (
        <main>
            <div className="flex justify-around p-3 h-1/5">
                <ModeToggle />
                <AddButton />
                <StartPauseButton
                    functionOnClick={toggleAutoplay}
                    isPlaying={isPlaying}
                />
                <SearchAndFilter
                    searchTerm={searchTerm}
                    onSearchChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex justify-center items-center h-[85vh]">
                <div className="w-[100vw] flex justify-center h-full">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-[90vw]  "
                        plugins={[plugin.current]}
                    >
                        <CarouselContent
                            className=" p-3"
                            onPointerDown={chanceButtonState}
                        >
                            {loading
                                ? Array.from({
                                      length: 10,
                                  }).map((_, index) => (
                                      <CarouselItem
                                          key={index}
                                          className="md:basis-1/2 lg:basis-1/3  p-6 pb-10"
                                      >
                                          <div
                                              key={index}
                                              className="p-3 flex-grow-0"
                                          >
                                              <CardWithData
                                                  loading={true}
                                                  id={1}
                                                  process_name={
                                                      "Nome do processo"
                                                  }
                                                  date={
                                                      new Date(
                                                          "01-01-2024 00:00:00"
                                                      )
                                                  }
                                                  active={0}
                                                  status={1}
                                              />
                                          </div>
                                      </CarouselItem>
                                  ))
                                : filteredData.map((item, index) => (
                                      <CarouselItem
                                          key={index}
                                          className="md:basis-1/2 lg:basis-1/3  p-6 pb-10"
                                      >
                                          <div
                                              key={item.id}
                                              className="p-3 flex-grow-0"
                                          >
                                              <CardWithData
                                                  id={item.id}
                                                  date={
                                                      item.status == 2
                                                          ? item.created_at
                                                          : item.finished_at
                                                  }
                                                  lastLogs={item.lastLogs}
                                                  active={item.active}
                                                  interval_description={
                                                      item.interval_description
                                                  }
                                                  status={item.status}
                                                  process_name={
                                                      item.process_name
                                                  }
                                              />
                                          </div>
                                      </CarouselItem>
                                  ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </main>
    );
}
