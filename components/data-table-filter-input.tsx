import { Table } from "@tanstack/react-table";
import React from "react";
import { Input } from "./ui/input";

interface DataTableFilterInputProps<TData> {
  column: string;
  table: Table<TData>;
}

export default function DataTableFilterInput<TData>({
  column,
  table,
}: DataTableFilterInputProps<TData>) {
  return (
    <Input
      placeholder="Filter..."
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className="max-w-sm m-4"
    />
  );
}
