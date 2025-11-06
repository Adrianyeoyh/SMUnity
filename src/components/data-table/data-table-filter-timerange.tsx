"use client";

import type { DateRange } from "react-day-picker";
import { useMemo } from "react";

import type { DataTableTimerangeFilterField } from "./types";
import { DatePickerWithRange } from "#client/components/custom/date-picker-with-range";
import { useDataTable } from "#client/components/data-table/data-table-provider";
import { isArrayOfDates } from "#client/lib/is-array";

export function DataTableFilterTimerange<TData>({
  value: _value,
  presets,
}: DataTableTimerangeFilterField<TData>) {
  const value = _value as string;
  const { table, columnFilters } = useDataTable();
  const column = table.getColumn(value);
  const filterValue = columnFilters.find((i) => i.id === value)?.value;

  const date: DateRange | undefined = useMemo(
    () =>
      filterValue instanceof Date
        ? { from: filterValue, to: undefined }
        : Array.isArray(filterValue) && isArrayOfDates(filterValue)
          ? { from: filterValue?.[0], to: filterValue?.[1] }
          : undefined,
    [filterValue],
  );

  const setDate = (date: DateRange | undefined) => {
    if (!date) return; 
    if (date.from && !date.to) {
      column?.setFilterValue([date.from]);
    }
    if (date.to && date.from) {
      column?.setFilterValue([date.from, date.to]);
    }
  };

  return <DatePickerWithRange {...{ date, setDate, presets }} />;
}
