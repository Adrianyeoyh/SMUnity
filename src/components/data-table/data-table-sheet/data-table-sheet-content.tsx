"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { cn } from "#client/lib/utils";
import { DataTableFilterField, SheetField } from "../types";
import { DataTableSheetRowAction } from "./data-table-sheet-row-action";
import { SheetDetailsContentSkeleton } from "./data-table-sheet-skeleton";

interface DataTableSheetContentProps<TData, TMeta>
  extends React.HTMLAttributes<HTMLDListElement> {
  data?: TData;
  table: Table<TData>;
  fields: SheetField<TData, TMeta>[];
  filterFields: DataTableFilterField<TData>[];
  // totalRows: number;
  // filterRows: number;
  // totalRowsFetched: number;
  metadata?: TMeta & {
    totalRows: number;
    filterRows: number;
    totalRowsFetched: number;
  };
}

export function DataTableSheetContent<TData, TMeta>({
  data,
  table,
  className,
  fields,
  filterFields,
  metadata,
  ...props
}: DataTableSheetContentProps<TData, TMeta>) {
  if (!data) return <SheetDetailsContentSkeleton fields={fields} />;

  return (
    <dl className={cn("divide-y", className)} {...props}>
      {fields.map((field) => {
        if (field.condition && !field.condition(data)) return null;

        const Component = field.component;
        const value = String(data[field.id]);

        return (
          <div key={field.id.toString()}>
            {field.type === "readonly" ? (
              <div
                className={cn(
                  "my-1 flex w-full items-center justify-between gap-4 py-1 text-sm",
                  field.className,
                )}
              >
                <dt className="text-muted-foreground shrink-0">
                  {field.label}
                </dt>
                <dd className="w-full text-right font-mono">
                  {Component ? (
                    <Component {...data} metadata={metadata} />
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ) : (
              <DataTableSheetRowAction
                fieldValue={field.id}
                filterFields={filterFields}
                value={value}
                table={table}
                className={cn(
                  "my-1 flex w-full items-center justify-between gap-4 py-1 text-sm",
                  field.className,
                )}
              >
                <dt className="text-muted-foreground shrink-0">
                  {field.label}
                </dt>
                <dd className="w-full text-right font-mono">
                  {Component ? (
                    <Component {...data} metadata={metadata} />
                  ) : (
                    value
                  )}
                </dd>
              </DataTableSheetRowAction>
            )}
          </div>
        );
      })}
    </dl>
  );
}

export const MemoizedDataTableSheetContent = React.memo(
  DataTableSheetContent,
  (prev, next) => {
    return prev.data === next.data;
  },
) as typeof DataTableSheetContent;
