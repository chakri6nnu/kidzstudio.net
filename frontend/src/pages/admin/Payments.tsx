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
import { MoreHorizontal, Search, Eye, Download } from "lucide-react";

export default function Payments() {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const payments = [
    {
      id: "payment_IPEaqV67ZvHM3fCO",
      paymentId: "payment_IPEaqV67ZvHM3fCO",
      plan: "Mathematics / Numerical Reasoning Mathematics / Numerical Reasoning Exam Preparation - 1 Months Plan",
      user: "Jithin Sriram Chennu",
      amount: "10 GBP",
      date: "Sat, Sep 27, 2025 3:56 PM",
      paymentMethod: "Razorpay",
      status: "SUCCESS"
    }
  ];

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Payments
          </h1>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Payment ID"
                  className="pl-10 w-48"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Method"
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
                  <TableHead>PAYMENT ID</TableHead>
                  <TableHead>PLAN</TableHead>
                  <TableHead>USER</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead>PAYMENT METHOD</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {payment.paymentId}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate text-sm">{payment.plan}</div>
                    </TableCell>
                    <TableCell>{payment.user}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success text-success-foreground">
                        {payment.status}
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
                          <DropdownMenuItem onClick={() => handleViewDetails(payment)}>
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

      {/* Payment Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Payment Details</SheetTitle>
            <SheetDescription>
              View payment information and transaction details
            </SheetDescription>
          </SheetHeader>
          
          {selectedPayment && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment ID</label>
                <p className="text-sm">{selectedPayment.paymentId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan</label>
                <p className="text-sm">{selectedPayment.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <p className="text-sm">{selectedPayment.date}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <p className="text-sm">{selectedPayment.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subscription User</label>
                <p className="text-sm">{selectedPayment.user}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                <p className="text-sm">{selectedPayment.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    {selectedPayment.status}
                  </Badge>
                  {" "}
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    EDIT
                  </Button>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Invoice</label>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm">INVOICE-00002</span>
                  <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                    <Download className="mr-1 h-3 w-3" />
                    Download
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