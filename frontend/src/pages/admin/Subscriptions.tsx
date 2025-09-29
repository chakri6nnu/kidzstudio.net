import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MoreHorizontal, Plus, Search, Eye } from "lucide-react";

export default function Subscriptions() {
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const subscriptions = [
    {
      id: "subscription_Jo4vKZTwnDO",
      code: "subscription_Jo4vKZTwnDO", 
      plan: "Mathematics / Numerical Reasoning Mathematics / Numerical Reasoning Exam Preparation - 1 Months Plan",
      user: "Jithin Sriram Chennu",
      starts: "Sep 27, 2025",
      ends: "Oct 27, 2025",
      payment: "payment_IPEaqV67ZvHM3fCO",
      status: "ACTIVE"
    }
  ];

  const handleViewDetails = (subscription: any) => {
    setSelectedSubscription(subscription);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Subscriptions
          </h1>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover">
          <Plus className="mr-2 h-4 w-4" />
          ADD MANUAL SUBSCRIPTION
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Code"
                  className="pl-10 w-40"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Plan"
                  className="pl-10 w-40"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search User"
                  className="pl-10 w-40"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Payment"
                  className="pl-10 w-40"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Status"
                  className="pl-10 w-40"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CODE</TableHead>
                  <TableHead>PLAN</TableHead>
                  <TableHead>USER</TableHead>
                  <TableHead>STARTS</TableHead>
                  <TableHead>ENDS</TableHead>
                  <TableHead>PAYMENT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {subscription.code}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{subscription.plan}</div>
                    </TableCell>
                    <TableCell>{subscription.user}</TableCell>
                    <TableCell>{subscription.starts}</TableCell>
                    <TableCell>{subscription.ends}</TableCell>
                    <TableCell>{subscription.payment}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(subscription)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Actions
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">ROWS PER PAGE:</span>
              <Select defaultValue="10">
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">PAGE</span>
              <Button variant="outline" size="sm">1</Button>
              <span className="text-sm text-muted-foreground">OF 1</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Subscription Details</SheetTitle>
            <SheetDescription>
              View subscription information and details
            </SheetDescription>
          </SheetHeader>
          
          {selectedSubscription && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription ID</label>
                <p className="text-sm">{selectedSubscription.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan</label>
                <p className="text-sm">{selectedSubscription.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment User</label>
                <p className="text-sm">{selectedSubscription.user}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription Starts</label>
                <p className="text-sm">{selectedSubscription.starts}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription Ends</label>
                <p className="text-sm">{selectedSubscription.ends}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    {selectedSubscription.status}
                  </Badge>
                  {" "}
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    EDIT
                  </Button>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="text-sm">Online</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Online Payment Details</label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">{selectedSubscription.payment}</span>
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    View Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}