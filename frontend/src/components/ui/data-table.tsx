import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Plus,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T = any> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface Action<T = any> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  variant?: "default" | "destructive";
  show?: (item: T) => boolean;
}

interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  onAdd?: () => void;
  addLabel?: string;
  viewMode?: "table" | "grid";
  onViewModeChange?: (mode: "table" | "grid") => void;
  renderGridItem?: (item: T, actions: Action<T>[]) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  onAdd,
  addLabel = "Add Item",
  viewMode = "table",
  onViewModeChange,
  renderGridItem,
  emptyMessage = "No items found",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const renderActions = (item: T) => {
    const visibleActions = actions.filter(action => 
      !action.show || action.show(item)
    );

    if (visibleActions.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {visibleActions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => action.onClick(item)}
              className={cn(
                action.variant === "destructive" && "text-destructive focus:text-destructive"
              )}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (data.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-muted-foreground mb-4">
          <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">{emptyMessage}</p>
          <p className="text-sm">Get started by adding your first item.</p>
        </div>
        {onAdd && (
          <Button onClick={onAdd} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {data.length} item{data.length !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center space-x-2">
          {onViewModeChange && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("table")}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange("grid")}
                className="h-8 px-3"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          )}
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" && renderGridItem ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedData.map((item, index) => renderGridItem(item, actions))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    style={{ width: column.width }}
                    className={cn(
                      column.sortable && "cursor-pointer select-none hover:bg-muted/50"
                    )}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          {sortKey === column.key ? (
                            sortOrder === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          ) : (
                            <div className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions.length > 0 && (
                  <TableHead className="w-12">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>{renderActions(item)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}