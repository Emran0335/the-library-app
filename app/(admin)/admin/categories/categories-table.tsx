"use client";
import React, { startTransition, useState } from "react";
import { Category, columns } from "./columns";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { deleteCategory } from "@/actions/actions";
import DataTable from "@/components/data-table";
import ConfirmationDialog from "@/components/confirmation-dialog";
import AddCategoryDialog from "@/components/add-category-dialog";

type CategoriesTableProps = {
  data: {
    category_id: number;
    category_name: string;
  }[];
  total: number;
};
export default function CategoriesTable({
  data,
}: {
  data: CategoriesTableProps;
}) {
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [itemToAction, setItemToAction] = useState<Category>();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleRowDelete = (item: Category) => {
    setOpenConfirmationDialog(true);
    setItemToAction(item);
  };

  const handleRowEdit = (item: Category) => {
    setItemToAction(item);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setOpenConfirmationDialog(false);
    if (itemToAction) {
      startTransition(async () => {
        await deleteCategory(itemToAction.category_id, pathname);
      });

      toast({ description: `${itemToAction.category_name} deleted` });
    }
  };

  return (
    <>
      <DataTable
        data={data.data}
        columns={columns}
        total={data.total}
        filter_column="category_name"
        onRowDelete={handleRowDelete}
        onRowEdit={handleRowEdit}
      />
      <AddCategoryDialog
        open={open}
        setOpen={setOpen}
        category={itemToAction}
      />
      <ConfirmationDialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        onConfirm={handleConfirm}
        message="By continuing you are going to delete the category, continue?"
      />
    </>
  );
}
