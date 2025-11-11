'use client';

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBannerDialog } from "@/components/add-banner-dialog";
import { ViewBannerDialog } from "@/components/view-banner-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type Banner = {
  id: string;
  name: string;
  school: string;
  targetAudience: "All" | "School Admins" | "Teachers" | "Students";
  startDate: string;
  endDate: string;
  media: string;
};

const useUserRole = () => {
  return "superAdmin"; // Can be 'superAdmin' or 'schoolAdmin'
};

interface BannerDataTableProps {
  data: Banner[];
  updateBanner: (updatedBanner: Banner) => void;
  deleteBanner: (bannerId: string) => void;
  schools: { id: string; name: string }[];
}

export function BannerDataTable({ data, updateBanner, deleteBanner, schools }: BannerDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const userRole = useUserRole();

  const columns: ColumnDef<Banner>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "school",
      header: "School",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <ViewBannerDialog banner={row.original}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </ViewBannerDialog>
          <AddBannerDialog banner={row.original} onSave={(updatedBanner) => updateBanner({ ...row.original, ...updatedBanner })} schools={schools} />
          <Button variant="destructive" size="icon" onClick={() => deleteBanner(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Input
                placeholder="Filter banners by name..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="w-full sm:w-auto flex-grow"
            />
            {userRole === 'superAdmin' && (
                <Select
                    value={(table.getColumn("school")?.getFilterValue() as string) ?? ""}
                    onValueChange={(value) => table.getColumn("school")?.setFilterValue(value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by school" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        {schools.map((school) => (
                            <SelectItem key={school.id} value={school.name}>
                                {school.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-40 w-full">
              <img
                src={row.original.media}
                alt={row.original.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold truncate">{row.original.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{row.original.school}</p>
              <div className="mt-4 flex justify-end">
                 {flexRender(row.getVisibleCells().find(c => c.column.id === 'actions')!.column.columnDef.cell, row.getVisibleCells().find(c => c.column.id === 'actions')!.getContext())}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
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
  );
}
