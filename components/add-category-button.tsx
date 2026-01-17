"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import AddCategoryDialog from "./add-category-dialog";

export default function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <Button className="self-end" onClick={()=> setOpen(true)}>
        <PlusIcon />
        Add category
      </Button>
      <AddCategoryDialog open={open} setOpen={setOpen} />
    </div>
  );
}
