"use client"

import * as React from "react"
import { DatePickerWithRange } from "@/app/historic/DatePickerWithRange/DatePickerWithRange"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardWithData } from "../CardWithData/CardWithData"
import { getConfigTableById } from "../services/configurationTable"
import { useState } from "react"
import { getLogsById } from "@/app/services/configurationControl";
import { format } from "date-fns"
import { DateRange } from "react-day-picker"


export type Data = {
  id: number;
  oracle_name: string;
  mysql_name: string;
  active: number;
  status: number;
  created_at: Date;
  finished_at: Date;
}

export const defaultData: Data = {
  id: 0,
  oracle_name: "",
  mysql_name: "",
  active: 0,
  status: 2, 
  created_at: new Date(),
  finished_at: new Date(),
};


export type Indicadores = {
  id: number
  runtime_second: number
  error: string
  started_at: Date
  finished_at: Date
  is_batch_call: "Verdadeiro" | "Falso" //execucao externa 
  status: "" | "success" | "failed"
}
const formatRuntime = (seconds: number) => {
  if (seconds > 60) {
    return `${Math.floor(seconds / 60)} minutos`;
  }
  return `${seconds} segundos`;
}

export const columns: ColumnDef<Indicadores>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status")
      const statusClass = 
          status === "failed" ? "text-red-500" 
          : status === "success" ? "text-green-500" 
          : ""

      return (
        <div className={`capitalize ${statusClass}`}>{row.getValue("status")}</div>
      )
    },
  },
  {
    accessorKey: "finished_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data da Sincronização
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("finished_at") as Date;
      const formattedDate = format(date, "dd/MM/yyyy HH:mm:ss"); 
      return <div className="lowercase">{formattedDate}</div>
    },
  },
  {
    accessorKey: "runtime_second",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Tempo de Execução
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const runtime = row.getValue("runtime_second") as number;
      return <div>{formatRuntime(runtime)}</div>
    },
  },
  {
    accessorKey: "error",
    header: () => "Erro",
    cell: ({ row }) => {
      const error = row.getValue("error") as string;
      return <div>{error || "Nenhum erro"}</div>
    },
  },
  {
    accessorKey: "started_at",
    header: () => "Início",
    cell: ({ row }) => {
      const date = row.getValue("started_at") as Date;
      const formattedDate = format(date, "dd/MM/yyyy HH:mm:ss");
      return <div className="lowercase">{formattedDate}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const indicadores = row.original

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
              onClick={() => navigator.clipboard.writeText(String(indicadores.id))}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(indicadores.finished_at))}
            >
              Copiar Data
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(indicadores.error)}
            >
              Copiar Erro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataTable() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [id, setId] = useState<string | null>(null)
  const [dataTable, setDataTable] = useState<Data | undefined>();
  const [logs, setLogs] = useState<Indicadores[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "finished_at", desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [filteredLogs, setFilteredLogs] = useState<Indicadores[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const table = useReactTable({
    data: filteredLogs,    
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
  })

  React.useEffect(() => {
    const path = window.location.pathname;
    const extractedId = path.split("/").pop();
  
    if (extractedId) {
      setId(extractedId);
    } else {
      console.error("ID não encontrado na URL");
      return;
    }
  
    const getData = async () => {
      setIsLoading(true);
  
      if (!id) {
        setIsLoading(false);
        return;
      }
  
      try {
        let status = 2; 
        let indicadoresData: Indicadores[] = [];
  
        try {
          const logsResult = await getLogsById(id);
          const logs = logsResult.data;
          
          indicadoresData = logs.map((log: any) => ({
            id: log.sync_control_id,
            status: log.success === 1 ? "success" : "failed",
            started_at: new Date(log.started_at),
            finished_at: new Date(log.finished_at),
            runtime_second: log.runtime_second,
            error: log.error,
            is_batch_call: log.is_batch_call === 1 ? "Verdadeiro" : "Falso",

          }));
          
          if (logs.length > 0) {
            status = logs[logs.length - 1].success ? 1 : 0;
            setLogs(indicadoresData);
          }
        } catch (error) {
          console.error("Erro ao buscar logs:", error);
        }
  
        try {
          const result = await getConfigTableById(id);
          const item = result;
  
          const configTables: Data = {
            id: item.data.id,
            oracle_name: item.data.oracle_name,
            mysql_name: item.data.mysql_name,
            active: item.data.active,
            status: status, 
            created_at: new Date(item.data.created_at),
            finished_at: new Date(item.finished_at),
          };
          setDataTable(configTables);
          
        } catch (error) {
          console.error("Erro ao buscar a configuração da tabela:", error);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    getData();
  }, [id]);

  React.useEffect(() => {
    if (logs.length > 0) {
      setDateRange({
        from: logs[0].finished_at,
        to: logs[logs.length - 1].finished_at
      });
    }
  }, [logs]);
  

  React.useEffect(() => {
    if ((dateRange?.from && dateRange?.to) && (dateRange.from != undefined && dateRange.to != undefined)) {
      const filtered = logs.filter(log => {
        const finished_at = new Date(log.finished_at)
        return finished_at >= dateRange.from && finished_at <= dateRange.to
      })
      setFilteredLogs(filtered)
    } else {
      setFilteredLogs(logs)
    }

  }, [dateRange, logs])
  
  
  
  

  return (
    <div className="w-2/3">
        {isLoading ? (
            <div className="flex justify-center items-center">
              <CardWithData 
                loading={true}
                id={1}
                date={new Date("01-01-2024 00:00:00")}
                active={0}
                status={1}
                nomeOracle={""}
                nomeInterno={""} 
              />
            </div>
        ) : ( dataTable? (
            <div className="flex justify-center items-center">
              <CardWithData
                id={dataTable.id}
                date={dataTable.status == 2 ? dataTable.created_at : dataTable.finished_at}
                active={dataTable.active}
                status={dataTable.status}
                nomeOracle={dataTable.oracle_name}
                nomeInterno={dataTable.mysql_name}
                showButton={false}
              />
            </div>) : (
            <div className="flex justify-center items-center">
            <CardWithData 
              loading={true}
              id={1}
              date={new Date("01-01-2024 00:00:00")}
              active={0}
              status={1}
              nomeOracle={""}
              nomeInterno={""} 
            />
          </div>
          )
        )}
        
      <div className="flex justify-center items-center py-4">
      <DatePickerWithRange
          from={logs.length > 0 ? logs[0].finished_at : undefined}
          to={logs.length > 0 ? logs[logs.length - 1].finished_at : undefined}
          onDateChange={setDateRange}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          </DropdownMenuTrigger>
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
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            A tabela ainda não foi sincronizada ainda.
          </div>
        ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
