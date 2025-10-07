"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import type { DataTableInputFilterField } from "./types";
import { InputWithAddons } from "#client/components/custom/input-with-addons";
import { useDataTable } from "#client/components/data-table/data-table-provider";
import { Label } from "#client/components/ui/label";
import { useDebounce } from "#client/hooks/use-debounce";

function getFilter(filterValue: unknown) {
  return typeof filterValue === "string" ? filterValue : null;
}

export function DataTableFilterInput<TData>({
  value: _value,
}: DataTableInputFilterField<TData>) {
  const value = _value as string;
  const { table, columnFilters } = useDataTable();
  const column = table.getColumn(value);
  const filterValue = columnFilters.find((i) => i.id === value)?.value;
  const filters = getFilter(filterValue);
  const [input, setInput] = useState<string | null>(filters);

  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    const newValue = debouncedInput?.trim() === "" ? null : debouncedInput;
    if (debouncedInput === null) return;
    column?.setFilterValue(newValue);
  }, [debouncedInput]);

  useEffect(() => {
    if (debouncedInput?.trim() !== filters) {
      setInput(filters);
    }
  }, [filters]);

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={value} className="text-muted-foreground sr-only px-2">
        {value}
      </Label>
      <InputWithAddons
        placeholder="Search"
        leading={<Search className="mt-0.5 h-4 w-4" />}
        containerClassName="h-9 rounded-lg"
        name={value}
        id={value}
        value={input || ""}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}
