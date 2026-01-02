import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CatalogTable from "./(catalog)/catalog-table";
import AddBookButton from "@/components/add-book-button";

export default function AdminPage() {
  return (
    <div className="p-2">
      <AddBookButton />
      <Suspense fallback={<Skeleton />}>
        <CatalogTable />
      </Suspense>
    </div>
  );
}
