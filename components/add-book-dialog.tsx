"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/app/(admin)/admin/(catalog)/columns";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCategories } from "@/actions/actions";

type AddBookDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  book?: Book;
};

const addBookFormSchema = z.object({
  id: z.number().default(-1),
  name: z.string().min(1),
  isbn: z.string().min(10).max(13),
  author: z.string(),
  publish_year: z.coerce
    .number({ message: "must be a number" })
    .positive({ message: "Value must be positive" }),
  no_of_copies: z.coerce
    .number({ message: "must be a number" })
    .positive({ message: "Value must be positive" }),
  category: z.array(z.number()).min(1, {
    message: "A book must have a category",
  }),
  photos: z.array(z.string()),
});

export default function AddBookDialog({
  open,
  setOpen,
  book,
}: AddBookDialogProps) {
  const [categories, setCategories] = useState<
    { category_id: number; category_name: string }[]
  >([]);
  const [processing, setProcessing] = useState(false);
  const path = usePathname();
  const { toast } = useToast();

  const bookForm = useForm({
    resolver: zodResolver(addBookFormSchema),
    defaultValues: {
      name: "",
      isbn: "",
      author: "",
      no_of_copies: 1,
      category: [],
      photos: [],
      publish_year: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    (async () => {
      const cats = await getCategories(0, -1);
      setCategories(cats.data);
    })();
  }, []);

  useEffect(() => {
    if (book) {
      bookForm.setValue("id", book.book_id);
      bookForm.setValue("name", book.name);
      bookForm.setValue("isbn", book.isbn);
      bookForm.setValue("no_of_copies", book.no_of_copies);
      bookForm.setValue("publish_year", book.publish_year);
      bookForm.setValue(
        "category",
        book.book_category_links?.map((c) => c.category_id) as number[],
      );
      bookForm.setValue("photos", book.book_photos?.map((p) => p.url) || []);
      bookForm.setValue("author", book.author);
    }
  }, [book, bookForm]);

  const handleItemSelect = (item: number)=> {
    const newValue = bookForm
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
