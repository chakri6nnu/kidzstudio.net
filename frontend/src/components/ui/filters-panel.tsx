import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, X, Download } from "lucide-react";

// New FilterOption interface
interface FilterOption {
  key: string;
  label: string;
  type: "select" | "search";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
}

// Old Filter interface for backward compatibility
interface LegacyFilter {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}

// New FiltersPanel props
interface NewFiltersPanelProps {
  filters: FilterOption[];
  onClearFilters: () => void;
}

// Legacy FiltersPanel props for backward compatibility
interface LegacyFiltersPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: LegacyFilter[];
  onFilterChange: (filterId: string, value: string) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
}

type FiltersPanelProps = NewFiltersPanelProps | LegacyFiltersPanelProps;

function isLegacyProps(props: FiltersPanelProps): props is LegacyFiltersPanelProps {
  return 'searchTerm' in props;
}

export function FiltersPanel(props: FiltersPanelProps) {
  if (isLegacyProps(props)) {
    // Legacy implementation
    const {
      searchTerm,
      onSearchChange,
      filters,
      onFilterChange,
      onClearFilters,
      onExport,
      searchPlaceholder = "Search..."
    } = props;

    const hasActiveFilters = searchTerm !== "" || filters.some(filter => filter.value !== "all");

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          
          {filters.map((filter) => (
            <Select 
              key={filter.id} 
              value={filter.value} 
              onValueChange={(value) => onFilterChange(filter.id, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-3 text-sm"
            >
              <X className="mr-2 h-3 w-3" />
              Clear Filters
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>
    );
  }

  // New implementation
  const { filters, onClearFilters } = props;
  const hasActiveFilters = filters.some(filter => filter.value && filter.value !== "" && filter.value !== "all");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {filters.map((filter) => (
              <div key={filter.key} className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {filter.label}:
                </span>
                
                {filter.type === "search" && (
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={filter.placeholder}
                      value={filter.value || ""}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="pl-8 h-9"
                    />
                  </div>
                )}

                {filter.type === "select" && (
                  <Select
                    value={filter.value || ""}
                    onValueChange={filter.onChange}
                  >
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-3 text-sm"
            >
              <X className="mr-2 h-3 w-3" />
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}