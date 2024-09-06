import * as React from "react"

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchAndFilter({ searchTerm, onSearchChange }: SearchAndFilterProps) {
  return (
      <div className="flex items-center justify-between  ">
          <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search by name..."
              className="border p-2 rounded w-full max-w-xs dark:bg-black"
          />
      </div>
  );
}
