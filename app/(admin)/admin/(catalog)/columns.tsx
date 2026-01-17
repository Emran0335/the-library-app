import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTableColumnHeader from "@/components/data-table-column-header";

type Photo = {
  photo_id: number;
  url: string;
};

export type Book = {
  book_id: number;
  name: string;
  no_of_copies: number;
  isbn: string;
  is_available: boolean;
  book_category_links?: {
    category_id: number;
  }[];
  book_photos?: Photo[];
  publish_year: number;
  author: string;
};
export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "book_photos",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
  },
];
