import * as React from "react";
import { Tracker } from "@tremor/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { EditButton } from "@/components/botoes/EditButton/EditButton";
import { PowerButton } from "@/components/botoes/PowerButton/PowerButton";
import { GraphicLastDataSpark } from "./GraphicLastDataSpark/GraphicLastDataSpark";
import { GraphicLastDataLine } from "./GraphicLastDataLine/GraphicLastDataLine";
import Status from "./Status/Status";
import LastUpdate from "./LastUpdate/LastUpdate";
import IntervalorSincronizacao from "./IntervalorSincronizacao/IntervalorSincronizacao";
import ReturnUnsynchronized from "@/components/botoes/ReturnUnsynchronized/ReturnUnsynchronized";

interface CardWithDataProps {
    id: number;
    process_name: string;
    date: Date;
    active: number;
    status: number;
    // interval_description?: Array<string>;
    interval_description?: string;
    showButton?: boolean;
    loading?: boolean;
    lastLogs?: Array<any>;
    activated_based_timer?: number;
    unsyncronized?: boolean;
}
export function CardWithData({
    id,
    process_name,
    date,
    status = 2,
    active: initialActive,
    showButton = true,
    loading = false,
    lastLogs = [],
    // interval_description = ["Sem dados","teste","teste"],
    interval_description = "Sem dados",
    activated_based_timer,
    unsyncronized = false,
}: CardWithDataProps) {
    const [active, setActive] = React.useState(initialActive);

    React.useEffect(() => {
        setActive(initialActive); // Garantir que o estado inicial esteja correto
    }, [initialActive]);

    const router = useRouter();
    // console.log(date)
    const formateDate = format(date, "dd/MM/yyyy HH:mm:ss");
    const firstData = lastLogs[0]?.finished_at
        ? format(new Date(lastLogs[0].finished_at), "dd/MM/yyyy")
        : "Data não disponível";
    const reversedLogs = lastLogs.slice().reverse();

    const lastData =
        lastLogs.length > 10
            ? lastLogs[9]?.finished_at
                ? format(new Date(lastLogs[9].finished_at), "dd/MM/yyyy")
                : "Data não disponível"
            : lastLogs[lastLogs.length - 1]?.finished_at
            ? format(
                  new Date(lastLogs[lastLogs.length - 1].finished_at),
                  "dd/MM/yyyy"
              )
            : "Data não disponível";
    const cardSkeletonClass = showButton
        ? "w-full h-full"
        : "w-[600px] h-[350px]";

    if (loading) {
        return (
            <Card
                className={`${cardSkeletonClass} m-4 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg animate-pulse`}
            >
                <CardHeader className="p-4">
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                </CardHeader>
                {showButton ? (
                    <CardContent className="p-0 pt-0">
                        <div className="p-6">
                            <div className="mb-2 h-4 pb-2 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            <div className="mb-2 h-6 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            <div className="mb-2 h-4 pb-2  bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            <div className="mb-2 h-6 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            <div className="mb-2 h-4 pb-2 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            <div className="mb-2 h-6 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                        </div>
                        <div className="p-1">
                            <div className="mb-2 h-64 p-2 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            <div className="pt-0 p-4">
                                <div className="mb-2 h-4 p-1 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                                <div className="mb-1 h-12 mt-2 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                            </div>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent>
                        <div className="flex flex-row">
                            <div className="flex flex-col items-center justify-center w-1/3 pr-10 pb-5">
                                <div className="mb-2 h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-md"></div>{" "}
                                <div className="mb-2 h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>{" "}
                                <div className="mb-2 h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                                <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>{" "}
                            </div>

                            {/* Esqueleto para a segunda coluna (GraphicLastDataLine) */}
                            <div className="w-2/3 flex flex-col items-stretch">
                                <div className="h-40 bg-gray-300 dark:bg-gray-600 rounded-md"></div>{" "}
                                {/* Esqueleto para GraphicLastDataLine */}
                            </div>
                        </div>

                        {/* Esqueleto para GraphicLastDataSpark */}
                        <div className="mt-12 w-full h-10 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                    </CardContent>
                )}
                {showButton && (
                    <CardFooter className="flex justify-evenly p-6 pt-0">
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                        <div className="h-10 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                    </CardFooter>
                )}
            </Card>
        );
    }
    const cardClass =
        active === 0
            ? showButton
                ? "w-full h-h-full  animation_default"
                : "w-[600px] h-[350px] animation_default"
            : showButton
            ? status === 0
                ? "w-full h-full  animation_failed"
                : status === 1
                ? "w-full h-full animation_success"
                : "w-full h-full animation_unsyncronized"
            : status === 0
            ? " w-[600px] h-[350px] animation_failed"
            : status === 1
            ? "w-[600px] h-[350px] animation_success"
            : "w-[600px] h-[350px] animation_unsyncronized";
    const titlesClass =
        active === 0
            ? "dark:text-gray-600 text-gray-600 truncate"
            : status === 0
            ? "dark:text-red-400 text-red-600 truncate " //600
            : status === 1
            ? "dark:text-green-300 text-green-600 truncate" //600
            : "dark:text-yellow-300 text-yellow-600 truncate"; //600
    const border =
        active === 0
            ? ""
            : status === 0
            ? "border dark:border-slate-900 rounded shadow-lg delay-200 hover:shadow-2xl transition transform duration-500 ease-in-out dark:border-2 dark:hover:border-red-500 dark:hover:shadow-red-500/50 p-2"
            : status === 1
            ? "border dark:border-slate-900 rounded shadow-lg delay-200 hover:shadow-2xl transition transform duration-500 ease-in-out dark:border-2 dark:hover:border-green-500 dark:hover:shadow-green-500/50 p-2"
            : "border dark:border-slate-900 rounded shadow-lg delay-200 hover:shadow-2xl transition transform duration-500 ease-in-out dark:border-2 dark:hover:border-yellow-500 dark:hover:shadow-yellow-500/50 p-2";
    const statusClass =
        active === 0
            ? "text-center text-balance text-gray-600"
            : status === 0
            ? "text-center text-balance text-red-600 dark:text-red-400" //600
            : status === 1
            ? "text-center text-balance text-green-600 dark:text-green-300" //600
            : "text-center text-balance text-yellow-600 dark:text-yellow-300"; //600

    const buttonClass =
        active === 0
            ? "bg-gray-600 transition-colors duration-700 hover:bg-gray-500"
            : status === 0
            ? " transition-colors duration-700 hover:bg-red-500  "
            : status === 1
            ? "transition-colors duration-700 hover:bg-green-500"
            : "transition-colors duration-700 hover:bg-yellow-500";
    const handleHistoric = () => {
        showButton ? router.push(`/historic/${id}`) : "";
    };
    return (
        <div className="relative">
            <Card
                className={`${cardClass} ${
                    unsyncronized && "cursor-not-allowed blur-sm"
                } ${showButton ? "cursor-pointer" : ""} m-4`}
                onClick={handleHistoric}
            >
                <CardHeader
                    className={showButton ? `p-4` : `items-center p-3 `}
                >
                    <CardTitle
                        className={`${titlesClass}`}
                        title={process_name}
                    >
                        {process_name}{" "}
                    </CardTitle>
                </CardHeader>
                {showButton ? (
                    <CardContent className={`p-0`}>
                        <div className={showButton ? `p-6` : `pb-10 pr-10`}>
                            <LastUpdate
                                status={status}
                                date={formateDate}
                                className=""
                            />
                            <Status
                                status={status}
                                active={active}
                                className={statusClass}
                            />
                            <IntervalorSincronizacao
                                intervaloSincronizacao={interval_description}
                            />
                        </div>

                        <div>
                            <div className="p-1">
                                <div className={`${border}  `}>
                                    <CardDescription className="pb-0">
                                        {status === 2 &&
                                        activated_based_timer === 0
                                            ? "Sem dados: "
                                            : "Tempo de execução em segundos: "}
                                    </CardDescription>

                                    {
                                        <div
                                            className={
                                                status !== 2
                                                    ? ""
                                                    : `text-gray-500 cursor-not-allowed blur-sm`
                                            }
                                        >
                                            <GraphicLastDataLine
                                                logs={lastLogs.slice(0, 10).reverse()}
                                                success={status}
                                                active={active}
                                            />
                                            <div className="flex justify-between">
                                                <CardDescription className="pb-0 ">
                                                    {status == 2
                                                        ? "Sem dados: "
                                                        : lastData}
                                                </CardDescription>
                                                <CardDescription className="pb-0">
                                                    {status == 2
                                                        ? "Sem dados: "
                                                        : firstData}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="pt-0 p-4">
                                    <CardDescription>
                                        {status == 2
                                            ? "Sem registros: "
                                            : "Status de sincronização: "}
                                    </CardDescription>
                                    <GraphicLastDataSpark
                                        logs={reversedLogs}
                                        success={status}
                                        active={active}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                ) : (
                    <CardContent className={`flex items-center flex-col`}>
                        <div className="flex flex-row">
                            <div
                                className={`p-0 flex items-center justify-center flex-col pr-10 pb-5`}
                            >
                                <CardDescription className="pb-2">
                                    {status === 2
                                        ? "Criado em: "
                                        : "Ultima Atulização: "}
                                </CardDescription>
                                <h1 className="text-center text-balance truncate">
                                    {formateDate}
                                </h1>

                                <Status
                                    status={status}
                                    active={active}
                                    className={statusClass}
                                    showButton={showButton}
                                />
                                <IntervalorSincronizacao
                                    intervaloSincronizacao={
                                        interval_description
                                    }
                                    className="text-center"
                                />
                            </div>
                            <div className={`w-2/3 items-stretch`}>
                                <div>
                                    <CardDescription className="pb-0">
                                        {status == 2
                                            ? "Sem dados: "
                                            : "Tempo de execução em segundos: "}
                                    </CardDescription>
                                    {
                                        <div
                                            className={
                                                status !== 2
                                                    ? ""
                                                    : `text-gray-500 cursor-not-allowed blur-sm`
                                            }
                                        >
                                            <GraphicLastDataLine
                                                logs={lastLogs
                                                    .slice(10, 20)
                                                    .reverse()}
                                                success={status}
                                                active={active}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex-col">
                            <CardDescription className="">
                                {status == 2
                                    ? "Sem registros: "
                                    : "Status de sincronização: "}
                            </CardDescription>

                            <GraphicLastDataSpark
                                logs={reversedLogs}
                                success={status}
                                active={active}
                            />
                        </div>
                    </CardContent>
                )}
                {showButton && (
                    <CardFooter className="flex place-content-evenly">
                        <EditButton id={id} />
                        <Button
                            className={`${buttonClass} ease-in-out border bg-gray-900 dark:text-white `}
                        >
                            <h3 className=" transition duration-700 hover:text-black">
                                See more
                            </h3>
                        </Button>
                        <PowerButton
                            active={active}
                            id={id}
                            onPowerChange={setActive}
                        />
                    </CardFooter>
                )}
            </Card>
            {unsyncronized && <ReturnUnsynchronized />}
        </div>
    );
}
