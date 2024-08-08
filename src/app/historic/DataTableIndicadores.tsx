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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CardWithData } from "../CardWithData/CardWithData"

//ajustar para quando tiver o back, eralizar uma request com todos os dados id=table.id

const data: Indicadores[] =  [
    // Dados para ID 1
    {
      id: 1,
      status: "success",
      lastUpdate: new Date('2024-07-01T12:00:00Z'), // Corresponde à data do ID 1
    },
    {
      id: 1,
      status: "success",
      lastUpdate: new Date('2024-07-02T12:00:00Z'),
    },
    {
      id: 1,
      status: "failed",
      lastUpdate: new Date('2024-07-03T12:00:00Z'),
    },
    
    // Dados para ID 2
    {
      id: 2,
      status: "failed",
      lastUpdate: new Date('2024-07-05T15:30:00Z'), // Corresponde à data do ID 2
    },
    {
      id: 2,
      status: "success",
      lastUpdate: new Date('2024-07-06T15:30:00Z'),
    },
    {
      id: 2,
      status: "success",
      lastUpdate: new Date('2024-07-07T15:30:00Z'),
    },
    
    // Dados para ID 3
    {
      id: 3,
      status: "success",
      lastUpdate: new Date('2024-07-10T08:45:00Z'), // Corresponde à data do ID 3
    },
    {
      id: 3,
      status: "failed",
      lastUpdate: new Date('2024-07-11T08:45:00Z'),
    },
    {
      id: 3,
      status: "success",
      lastUpdate: new Date('2024-07-12T08:45:00Z'),
    },
    
    // Dados para ID 4
    {
      id: 4,
      status: "success",
      lastUpdate: new Date('2024-07-15T09:00:00Z'), // Corresponde à data do ID 4
    },
    {
      id: 4,
      status: "failed",
      lastUpdate: new Date('2024-07-16T09:00:00Z'),
    },
    {
      id: 4,
      status: "success",
      lastUpdate: new Date('2024-07-17T09:00:00Z'),
    },
    
    // Dados para ID 5
    {
      id: 5,
      status: "failed",
      lastUpdate: new Date('2024-07-20T14:30:00Z'), // Corresponde à data do ID 5
    },
    {
      id: 5,
      status: "success",
      lastUpdate: new Date('2024-07-21T14:30:00Z'),
    },
    {
      id: 5,
      status: "success",
      lastUpdate: new Date('2024-07-22T14:30:00Z'),
    },
  ];

export type Indicadores = {
  id: number
  status: "pending" | "processing" | "success" | "failed"
  lastUpdate: Date
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
    )},
  },
  {
    accessorKey: "lastUpdate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data da Atualização
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = row.getValue("lastUpdate") as Date;
        const formattedDate = date.toLocaleString(); 
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
              onClick={() => navigator.clipboard.writeText(String(indicadores.lastUpdate))}
            >
              Copiar Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>(Realizar acao)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "lastUpdate", desc: false },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
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

  return (
    <div className="w-2/3">
        <div className="flex justify-center items-center">
            <CardWithData 
                id = {1}
                date={new Date('2024-07-20T14:30:00Z')}
                status={1}
                nomeOracle="Teste oraCLE"
                nomeInterno="Teste inter no"
                showButton={false}
                />
        </div>
      <div className="flex justify-center items-center py-4">
        <DatePickerWithRange/>
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
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
