import { prisma } from "@/lib/prisma";
import React, { Suspense } from "react";
import CategoriesTable from "./categories-table";
import AddCategoryButton from "@/components/add-category-button";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { page: string; limit: string };
}) {
  const params = await searchParams;
  const offset = Number(params.page ?? 1);
  const take = Number(params.limit ?? 10);

  const [categories, total] = await prisma.$transaction([
    prisma.book_categories.findMany({ skip: offset, take: take }),
    prisma.book_categories.count(),
  ]);

  return (
    <div className="p-4 flex flex-col space-y-4">
      <AddCategoryButton />
      <Suspense fallback={<Skeleton />}>
        <CategoriesTable data={{ data: categories, total: total }} />
      </Suspense>
    </div>
  );
}
