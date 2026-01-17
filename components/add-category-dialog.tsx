"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category } from "@/app/(admin)/admin/categories/columns";
import { Button } from "./ui/button";
import { addCategory, updateCategory } from "@/actions/actions";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

type AddCategoryDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category?: Category;
};

const categoryFormSchema = z.object({
  id: z.number().default(-1),
  name: z.string().min(2, { message: "Category must be entered" }).max(20),
});

export default function AddCategoryDialog({
  open,
  setOpen,
  category,
}: AddCategoryDialogProps) {
  const { toast } = useToast();

  const path = usePathname();

  const categoryForm = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      categoryForm.setValue("id", category.category_id);
      categoryForm.setValue("name", category.category_name);
    }
  }, [category, categoryForm]);

  const onSubmit = async (values: z.infer<typeof categoryFormSchema>) => {
    try {
      let message = "Category has been saved";

      if (category) {
        await updateCategory(category.category_id, values.name, path);

        message = "Category updated";
      } else {
        await addCategory(values.name, path);
      }

      toast({ description: message });

      categoryForm.reset();
    } catch (error) {
      console.log(error);
      toast({ description: "Failed to perform add category action" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...categoryForm}>
            <form
              className="space-y-2"
              onSubmit={categoryForm.handleSubmit(onSubmit)}
            >
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="category name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
