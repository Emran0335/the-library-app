import AddBookButton from "@/components/add-book-button";
import CatalogTable from "./(catalog)/catalog-table";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const params = await searchParams;
  const pageIndex = Number(params.page ?? 0);
  const pageSize = Number(params.limit ?? 10);

  const skip = pageIndex * pageSize;
  const take = pageSize;

  const [books, total] = await prisma.$transaction([
    prisma.books.findMany({
      skip,
      take,
      select: {
        book_id: true,
        name: true,
        no_of_copies: true,
        isbn: true,
        is_available: true,
        publish_year: true,
        author: true,
        book_photos: {
          select: { photo_id: true, url: true },
        },
        book_category_links: {
          select: { category_id: true },
        },
      },
    }),
    prisma.books.count(),
  ]);

  return (
    <div className="p-4">
      <AddBookButton />
      <Suspense fallback={<Skeleton />}>
        <CatalogTable data={{ data: books, total }} />
      </Suspense>
    </div>
  );
}
