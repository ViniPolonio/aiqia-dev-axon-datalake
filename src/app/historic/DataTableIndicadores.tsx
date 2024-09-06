"use client";

import * as React from "react";
import { DatePickerWithRange } from "@/app/historic/DatePickerWithRange/DatePickerWithRange";
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, LoaderIcon, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CardWithData } from "../CardWithData/CardWithData";
import { getControllById } from "../services/controlConfig";
import { useState } from "react";
import { getLogsById, nextPage } from "@/app/services/controlLogs";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { se } from "date-fns/locale";
import { setEngine } from "crypto";
import TableSkeleton from "./TableSkeleton/TableSkeleton";

export type Data = {
    id: number;
    process_name: string;
    activated_based_timer: number;
    active: number;
    status: number;
    created_at: Date;
    finished_at: Date;
    interval_description: string;
};

export const defaultData: Data = {
    id: 0,
    process_name: "",
    activated_based_timer: 0,
    interval_description: "",
    active: 0,
    status: 2,
    created_at: new Date(),
    finished_at: new Date(),
};

export type Indicadores = {
    id: number;
    sync_control_time_config_id: number;
    process_type: string;
    runtime_second: number;
    status: "" | "success" | "failed";
    error: string;
    created_at: Date;
    started_at: Date;
    finished_at: Date;
};
const formatRuntime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = Math.floor(seconds % 60);

    if (minutes >= 1) {
        return `${minutes} Minutos e ${remainSeconds} Segundos`;
    }
    return `${seconds} Segundos`;
};

export const columns: ColumnDef<Indicadores>[] = [
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue("status");
            const statusClass =
                status === "failed"
                    ? "text-red-500"
                    : status === "success"
                    ? "text-green-500"
                    : "";

            return (
                <div className={`capitalize ${statusClass}`}>
                    {row.getValue("status")}
                </div>
            );
        },
    },
    {
        accessorKey: "sync_control_time_config_id",
        header: ({ column }) => {
            return (
                <div className="whitespace-normal break-words">
                    ID da Configuracao de Sincronização
                </div>
            );
        },
        cell: ({ row }) => {
            const syncControlTimeConfigId = row.getValue(
                "sync_control_time_config_id"
            ) as number;
            return <div className="lowercase">{syncControlTimeConfigId}</div>;
        },
    },
    {
        accessorKey: "finished_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Data da Sincronização
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.getValue("finished_at") as Date;
            const formattedDate = format(date, "dd/MM/yyyy HH:mm:ss");
            return <div className="lowercase">{formattedDate}</div>;
        },
    },
    {
        accessorKey: "started_at",
        header: () => "Início",
        cell: ({ row }) => {
            const date = row.getValue("started_at") as Date;
            const formattedDate = format(date, "dd/MM/yyyy HH:mm:ss");
            return <div className="lowercase">{formattedDate}</div>;
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Data de Criação
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.getValue("created_at") as Date;
            const formattedDate = format(date, "dd/MM/yyyy HH:mm:ss");
            return <div className="lowercase">{formattedDate}</div>;
        },
    },

    {
        accessorKey: "runtime_second",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Tempo de Execução
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const runtime = row.getValue("runtime_second") as number;
            return <div>{formatRuntime(runtime)}</div>;
        },
    },
    {
        accessorKey: "error",
        header: () => "Erro",
        cell: ({ row }) => {
            const error = row.getValue("error") as string;
            const [copied, setCopied] = useState(false);

            return (
                <div className="max-w-40 max-h-20 overflow-y-auto whitespace-normal break-words">
                    {error === "" ? (
                        "Nenhum erro"
                    ) : (
                        <Dialog>
                            <DialogTrigger
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className="text-red-500 transition-colors duration-700 ease-in-out hover:text-red-800 dark:hover:text-red-200">
                                    Ver Erro
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                onClick={(event) => event.stopPropagation()}
                                className="justify-center flex flex-col items-center"
                            >
                                <DialogHeader className="mb-4">
                                    <DialogTitle>Erro:</DialogTitle>
                                </DialogHeader>
                                <div className="justify-center flex flex-col items-center text-center">
                                    {error}
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                error
                                            );
                                            setCopied(true);
                                            setTimeout(
                                                () => setCopied(false),
                                                2000
                                            );
                                        }}
                                    >
                                        {copied ? "Copiado" : "Copiar erro"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: "process_type",
        header: () => "Tipo de processo",
        cell: ({ row }) => {
            const processType = row.getValue("process_type") as string;
            return <div> {processType}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const indicadores = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    String(indicadores.id)
                                )
                            }
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    String(indicadores.finished_at)
                                )
                            }
                        >
                            Copiar Data
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(indicadores.error)
                            }
                        >
                            Copiar Erro
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default function DataTable() {
    const [isLoadingCard, setIsLoadingCard] = React.useState(true);
    const [isLoadingData, setIsLoadingData] = React.useState(true);
    const [isGettingMoreData, setIsGettingMoreData] = React.useState(false);
    const [id, setId] = useState<string | null>(null);
    const [dataTable, setDataTable] = useState<Data | undefined>();
    const [logs, setLogs] = useState<Indicadores[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "finished_at", desc: true },
    ]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [lastLogs, setLastLogs] = useState<Array<any>>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [filteredLogs, setFilteredLogs] = useState<Indicadores[]>([]);
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    });
    const [linkNextPage, setLinkNextPage] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const observer = React.useRef<IntersectionObserver | null>(null);

    const table = useReactTable({
        data: filteredLogs,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        // onPaginationChange: setPagination,
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const getMoreData = async () => {
        let indicadoresData: Indicadores[] = [];
        setIsGettingMoreData(true);

        try {
            const response = await nextPage(linkNextPage);
            const logs = response.data.logs;
            console.log(logs.data);
            console.log(response);
            if (response.status === 1) {
                setLinkNextPage(logs.next_page_url);
                setHasMore(response.data.has_more);
                indicadoresData = logs.data.map((log: any) => ({
                    id: log.id,
                    sync_control_time_config_id:
                        log.sync_control_time_config_id,
                    status: log.success === 1 ? "success" : "failed",
                    started_at: new Date(log.started_at),
                    finished_at: new Date(log.finished_at),
                    created_at: new Date(log.created_at),
                    runtime_second: log.runtime_second,
                    error:
                        log.success === 0 && log.error === ""
                            ? "Erro desconhecido"
                            : log.error,
                    process_type: log.process_type,
                }));
                setLogs((prevLogs) => [...prevLogs, ...indicadoresData]);
            }
        } catch (error) {
            console.error("Erro ao buscar mais logs:", error);
        } finally {
            setIsGettingMoreData(false);
        }
    };
    const getData = async () => {
        setIsLoadingCard(true);
        setIsLoadingData(true);

        if (!id) {
            setIsLoadingCard(false);
            setIsLoadingData(true);
            return;
        }

        try {
            let status = 2;
            let indicadoresData: Indicadores[] = [];

            try {
                const Result = await getLogsById(id);
                const data = Result.data;
                const { config, logs, has_more } = data;
                console.log(Result);
                console.log(logs.data.length === 0);

                setLinkNextPage(logs.next_page_url);
                setHasMore(has_more);
                
                const configTables: Data = {
                    id: config.id,
                    process_name: config.process_name,
                    active: config.active,
                    status:
                        logs.data.length === 0
                            ? 2
                            : config.interval_status === 2
                            ? 3
                            : logs.data[0].success,
                    created_at: new Date(config.created_at),
                    activated_based_timer: config.interval_status,
                    finished_at:
                        logs.data.length === 0
                            ? new Date(0)
                            : new Date(logs.data[0].finished_at),
                    interval_description: config.interval_description,
                };
                console.log(configTables);
                setDataTable(configTables);
                if (Result.status === 1) {
                    indicadoresData = logs.data.map((log: any) => ({
                        id: log.id,
                        sync_control_time_config_id:
                            log.sync_control_time_config_id,
                        status: log.success === 1 ? "success" : "failed",
                        started_at: new Date(log.started_at),
                        finished_at: new Date(log.finished_at),
                        created_at: new Date(log.created_at),
                        runtime_second: log.runtime_second,
                        error:
                            log.success === 0 && log.error === ""
                                ? "Erro não informado"
                                : log.error,
                        process_type: log.process_type,
                    }));
                    // const lastElements =
                    //     indicadoresData.slice(-20) || indicadoresData;

                    const updatedLastElements = indicadoresData.map(
                        (element) => {
                            return {
                                ...element,
                                status: element.status === "success" ? 1 : 0,
                            };
                        }
                    );
                    console.log(updatedLastElements);
                    setLastLogs(updatedLastElements);
                    if (indicadoresData.length > 0) {
                        setLogs(indicadoresData);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar logs:", error);
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setIsLoadingCard(false);
            setIsLoadingData(false);
        }
    };

    const setHigh = (length: number) => {
        switch (length) {
            case 1:
                return "h-[8vh]";
            case 2:
                return "h-[16vh]";
            case 3:
                return "h-[24vh]";
            case 4:
                return "h-[32vh]";
        }
    }

    const lastPostElementRef = React.useCallback(
        (node: any) => {
            if (isGettingMoreData) return;
            if (observer.current) observer.current.disconnect();

            if (!observer.current !== undefined) {
                observer.current = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        getMoreData();
                    }
                });
            }

            if (node && observer.current) observer.current.observe(node);
        },
        [isGettingMoreData]
    );

    React.useEffect(() => {
        if (filteredLogs.length === 0) {
            getMoreData();
        }
    }, [filteredLogs]);

    React.useEffect(() => {
        const path = window.location.pathname;
        const extractedId = path.split("/").pop();

        if (extractedId) {
            setId(extractedId);
        } else {
            console.error("ID não encontrado na URL");
            return;
        }

        getData();
    }, [id]);

    // React.useEffect(() => {
    //     if (logs.length > 0) {
    //         setDateRange({
    //             from: logs[0].finished_at,
    //             to: logs[logs.length - 1].finished_at,
    //         });
    //     }
    // }, [logs]);

    React.useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            console.log(logs[1].finished_at);
            const filtered = logs.filter((log) => {
                const finished_at = new Date(log.finished_at);
                return dateRange.from != undefined && dateRange.to != undefined
                    ? finished_at >= dateRange.from &&
                          finished_at <= dateRange.to
                    : null;
            });
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [dateRange, logs]);

    // console.log(dataTable?.created_at, dataTable?.finished_at, lastLogs);
    {
        console.log(logs);
    }

    return (
        <div className="w-4/5">
            {isLoadingCard ? (
                <div className="flex justify-center items-center">
                    <CardWithData
                        loading={true}
                        id={1}
                        date={new Date("01-01-2024 00:00:00")}
                        active={0}
                        status={1}
                        process_name={""}
                        showButton={false}
                    />
                </div>
            ) 
            : dataTable ? (
                <div className="flex justify-center items-center">
                    <CardWithData
                        id={dataTable.id}
                        date={
                            dataTable.status == 2
                                ? dataTable.created_at
                                : dataTable.finished_at
                        }
                        active={dataTable.active}
                        status={dataTable.status}
                        process_name={dataTable.process_name}
                        showButton={false}
                        lastLogs={lastLogs.slice().reverse()}
                        interval_description={dataTable.interval_description}

                    />
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <CardWithData
                        unsyncronized={true}
                        id={0}
                        date={new Date("01-01-2024 00:00:00")}
                        active={1}
                        status={2}
                        process_name={""}
                        showButton={false}
                    />
                </div>
            )}
            {isLoadingData ? (
                <div className="flex items-center justify-center flex-col w-full">
                    <TableSkeleton />
                </div>
            ) : (
                <div>
                    <div className="flex justify-center items-center py-4">
                        <DatePickerWithRange
                            
                            onDateChange={setDateRange}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div>
                        <div className="rounded-md border">
                            {logs.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    <h1>
                                        A tabela ainda não foi sincronizada.
                                    </h1>
                                </div>
                            ) : (
                                <ScrollArea className={`h-[${ 4 > filteredLogs.length ? filteredLogs.length * 10 : 40 }vh] w-full`}>
                                    <Table className="overflow-auto">
                                        <TableHeader className="sticky top-0">
                                            {table
                                                .getHeaderGroups()
                                                .map((headerGroup) => (
                                                    <TableRow
                                                        key={headerGroup.id}
                                                    >
                                                        {headerGroup.headers.map(
                                                            (header) => {
                                                                return (
                                                                    <TableHead
                                                                        key={
                                                                            header.id
                                                                        }
                                                                    >
                                                                        {header.isPlaceholder
                                                                            ? null
                                                                            : flexRender(
                                                                                  header
                                                                                      .column
                                                                                      .columnDef
                                                                                      .header,
                                                                                  header.getContext()
                                                                              )}
                                                                    </TableHead>
                                                                );
                                                            }
                                                        )}
                                                    </TableRow>
                                                ))}
                                        </TableHeader>
                                        <TableBody>
                                            {table.getRowModel().rows
                                                ?.length ? (
                                                table
                                                    .getRowModel()
                                                    .rows.map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            data-state={
                                                                row.getIsSelected() &&
                                                                "selected"
                                                            }
                                                        >
                                                            {row
                                                                .getVisibleCells()
                                                                .map((cell) => (
                                                                    <TableCell
                                                                        key={
                                                                            cell.id
                                                                        }
                                                                        ref={
                                                                            lastPostElementRef
                                                                        }
                                                                    >
                                                                        {flexRender(
                                                                            cell
                                                                                .column
                                                                                .columnDef
                                                                                .cell,
                                                                            cell.getContext()
                                                                        )}
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                    ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={columns.length}
                                                        className="h-24 text-center"
                                                    >
                                                        Sem resultados
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    <div className="flex items-center justify-center space-x-2 py-4">
                                        <div className="space-x-2 flex">
                                            <Button
                                                size="sm"
                                                onClick={getMoreData}
                                                disabled={
                                                    !hasMore ||
                                                    isGettingMoreData
                                                }
                                            >
                                                {hasMore ? (
                                                    isGettingMoreData ? (
                                                        <div className="animate-spin h-5 w-5 border-white rounded-full items-center justify-center flex">
                                                            <LoaderIcon />
                                                        </div>
                                                    ) : (
                                                        "Carrregar mais"
                                                    )
                                                ) : (
                                                    "Nao tem mais logs"
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={getData}
                                                disabled={isLoadingData}
                                            >
                                                {" "}
                                                Recarregar dados
                                            </Button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
