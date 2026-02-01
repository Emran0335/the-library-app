"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Book } from "@/app/(admin)/admin/(catalog)/columns";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addBook,
  addPhoto,
  deletePhoto,
  getCategories,
  updateBook,
} from "@/actions/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

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

  const handleItemSelect = (item: number) => {
    const newValue = bookForm.getValues("category").slice();
    const itemIndex = newValue.indexOf(item);

    if (itemIndex === -1) {
      newValue.push(item);
    } else {
      newValue.splice(itemIndex, 1);
    }

    bookForm.setValue("category", newValue);
  };

  const handleSubmit = async (values: z.infer<typeof addBookFormSchema>) => {
    setProcessing(true);

    let message = "Book added";

    if (book) {
      await updateBook({ ...values, path });
      message = "Book updated";
      setOpen(false);
    } else {
      await addBook({ ...values, path });
    }

    toast({ description: message });

    bookForm.reset();
    setProcessing(false);
  };

  const handleFileAdded = async (uploadedFiles: string[]) => {
    if (book) {
      const newPhoto = await addPhoto(
        "book",
        book.book_id,
        uploadedFiles[0],
        path,
      );

      if (newPhoto) {
        book.book_photos?.push(newPhoto);
      }
    }

    const existinPhotos = bookForm.getValues("photos");

    bookForm.setValue("photos", [...existinPhotos, ...uploadedFiles]);
  };

  const handleFileDelete = async (url: string) => {
    if (book) {
      const photoToDelete = book.book_photos?.filter(
        (book_photo) => book_photo.url === url,
      );

      if (photoToDelete && photoToDelete.length > 0) {
        await deletePhoto("book", photoToDelete[0].photo_id, path);
      }
    }

    const updatedPhoto =
      bookForm.getValues("photos").filter((book_photo) => book_photo !== url) ??
      [];

    bookForm.setValue("photos", updatedPhoto);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
          <DialogDescription></DialogDescription>
          <Form {...bookForm}>
            <form onSubmit={bookForm.handleSubmit(handleSubmit)}>
              <FormField
                control={bookForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Name</FormLabel>
                    <FormControl>
                      <Input placeholder="book name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={bookForm.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="book name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={bookForm.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="XXX-X-XX-XXXXXX-X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={bookForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Popover>
                      <PopoverTrigger>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value.length > 0
                              ? field.value
                                  .map(
                                    (val) =>
                                      categories.find(
                                        (c) => c.category_id === val,
                                      )?.category_name,
                                  )
                                  .join("")
                              : "Select a category"}
                              <ChevronsUpDown className="opacity-50"/>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                    </Popover>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
