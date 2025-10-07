import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createStandardSchemaV1, useQueryStates } from "nuqs";

import { columns } from "../components/data-table-demo/columns";
import { filterFields } from "../components/data-table-demo/constants";
import { data } from "../components/data-table-demo/data";
import { DataTable } from "../components/data-table-demo/data-table";
import { searchParamsParser } from "../components/data-table-demo/search-params";
import { Skeleton } from "../components/data-table-demo/skeleton";

export const Route = createFileRoute("/data-table-demo")({
  component: RouteComponent,
  validateSearch: createStandardSchemaV1(searchParamsParser, {
    partialOutput: true,
  }),
});

function RouteComponent() {
  const [search] = useQueryStates(searchParamsParser);

  return (
    <main className="container mx-auto flex min-h-screen flex-col gap-4 p-4 sm:p-8">
      <div className="border-border/50 bg-background/50 relative mx-auto flex h-full min-h-full w-full max-w-7xl flex-col gap-4 rounded-lg border p-4 backdrop-blur-[2px] sm:gap-8 sm:p-8">
        <React.Suspense fallback={<Skeleton />}>
          <DataTable
            columns={columns}
            data={data}
            filterFields={filterFields}
            defaultColumnFilters={Object.entries(search)
              .map(([key, value]) => ({
                id: key,
                value,
              }))
              .filter(({ value }) => value !== undefined && value !== null)}
          />
        </React.Suspense>
      </div>
    </main>
  );
}
