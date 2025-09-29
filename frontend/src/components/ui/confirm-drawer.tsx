import React from "react";
import { Button } from "@/components/ui/button";
import { SideDrawer } from "@/components/ui/side-drawer";
import { AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  icon?: React.ReactNode;
}

export function ConfirmDrawer({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  icon,
}: ConfirmDrawerProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title=""
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
          {icon || <Trash2 className="h-8 w-8 text-destructive" />}
        </div>
        
        <div className="text-center space-y-3">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <div className="space-y-2">
            <p className="text-muted-foreground">{description}</p>
            {itemName && (
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium text-foreground">Item: <span className="text-primary">{itemName}</span></p>
              </div>
            )}
            <p className="text-sm text-destructive font-medium">This action cannot be undone.</p>
          </div>
        </div>

        <div className="flex flex-col space-y-3 w-full pt-4">
          <Button onClick={handleConfirm} variant={variant} className="w-full">
            {confirmText}
          </Button>
          <Button onClick={handleCancel} variant="outline" className="w-full">
            {cancelText}
          </Button>
        </div>
      </div>
    </SideDrawer>
  );
}