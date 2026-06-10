"use client";
import { currency, getStatusColor } from "@/admin/app/constants";
import { Bookmark, MoreVertical } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { format } from "date-fns";

// Helper function to safely parse and format dates
const safeFormatDate = (dateValue, dateFormat = "MMM d, yyyy") => {
  if (!dateValue) return '-';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '-';
    return format(date, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

const MobileCard = ({invoice, type = "Invoices", dropdown, handleClick, respType = "dashboard", status}) => {
  return (
    // <div className="w-full rounded-xl bg-white p-4 shadow-sm">
      <Card className={"px-0 py-2"}>
        <CardContent className={"w-full px-4 py-2"}>
          <div className="w-full">
              <div className="flex items-center justify-between mb-1 border-b border-dotted border-[#E9EAEB] py-2">
                <div className="flex items-center gap-2">
                  <Image src={type === "Revenue" ? "/icons/invoice-blue.svg" : "/icons/document-blue.svg"} width={20} height={20} alt="bookmark"/>
                  <p 
                    className="font-bold text-sm"
                    onClick={() => handleClick && handleClick(invoice)}
                  >
                    {type === "Invoices" ? invoice?.invoice_number : type === "Revenue" ? invoice?.revenue_number || invoice?.revenueNo : respType === "Assets" ? invoice?.seriesDetails : invoice?.invoice_number || invoice?.invoiceNo}
                  </p>
                </div>

               {type !== "history" && type !== "Anchor" ?
                  <span className={`rounded-full ${getStatusColor(invoice?.status || status)} text-xs font-medium px-2.5 py-0.5`}>
                    {invoice?.status || status}
                  </span> : 
                    (dropdown && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={"min-w-56"}>
                        <DropdownMenuItem className={"text-customBlack font-semibold p-4 cursor-pointer"}>Actions</DropdownMenuItem>
                        <hr />
                            {
                              dropdown?.map((action, idx) => (
                              <DropdownMenuItem key={idx} className={`p-4 text-sm cursor-pointer ${action?.title === "Delete" ? "text-[#EF4444]" : ""}`} onClick={() => action?.handleClick && action?.handleClick(invoice)}>{action?.title}</DropdownMenuItem>
                            ))
                            }
                          </DropdownMenuContent>
                      </DropdownMenu>
                    ))
                }
              </div>

              {/* Invoice details */}
              {type === "Invoices" ? 
                <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Amount</p>
                    <p className="font-medium text-xs">{currency}  {(invoice?.invoice_amount || invoice?.invoice_value)?.toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Issue Date</p>
                    <p className="font-medium text-xs">{safeFormatDate(invoice?.issue_date || invoice?.invoice_date, "MMM d, yyyy")}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Due Date</p>
                    <p className="font-medium text-xs">{safeFormatDate(invoice?.due_date || invoice?.invoice_due_date, "MMM d, yyyy")}</p>
                  </div>

                  <div className="flex justify-between">
                    <p className="font-normal text-xs">Anchor</p>
                    <p className="font-medium text-xs">{invoice?.anchor_name}</p>
                  </div>
                </div>: 
              type === "Revenue" ?
                <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Revenue Value</p>
                    <p className="font-medium text-xs">{invoice?.value ? invoice?.value : `${currency} ${(invoice?.revenue_value)?.toLocaleString()}`}  </p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Tenor</p>
                    <p className="font-medium text-xs">{invoice?.tenor} Months</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Start Date</p>
                    <p className="font-medium text-xs">{invoice?.startDate ? invoice?.startDate : safeFormatDate(invoice?.start_date, "LLL dd, y") }</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">End Date</p>
                    <p className="font-medium text-xs">{invoice?.endDate ? invoice?.endDate : safeFormatDate(invoice?.end_date, "LLL dd, y")}</p>
                  </div>
                </div> :
              type === "Investor" ?
                (respType === "Assets" ?
                  <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Guaranteed By</p>
                    <p className="font-medium text-xs">{invoice?.guaranteedBy}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Issue Date</p>
                    <p className="font-medium text-xs">{invoice?.issueDate}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Asset Size</p>
                    <p className="font-medium text-xs">{currency} {(invoice?.assetSize)?.toLocaleString()}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Maturity Date</p>
                    <p className="font-medium text-xs">{invoice?.maturityDate}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Tenor</p>
                    <p className="font-medium text-xs">{invoice?.tenorDays} Days</p>
                  </div>

                </div> :
                <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Invoice Value</p>
                    <p className="font-medium text-xs">{invoice?.invoiceValue}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Bid Amount</p>
                    <p className="font-medium text-xs">{invoice?.bidAmount}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Transaction Date</p>
                    <p className="font-medium text-xs">{invoice?.transactionDate}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Anchor</p>
                    <p className="font-medium text-xs">{invoice?.anchor}</p>
                  </div>

                </div>) :
              type === "Anchor" ?
                (respType = "invoices" ?
                  <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Vendor</p>
                    <p className="font-medium text-xs">{invoice?.vendor}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Issue Date</p>
                    <p className="font-medium text-xs">{invoice?.issueDate}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Amount</p>
                    <p className="font-medium text-xs">{currency} {invoice?.amount}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Due Date</p>
                    <p className="font-medium text-xs">{invoice?.dueDate}</p>
                  </div>

                </div>: 
                <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Vendor</p>
                    <p className="font-medium text-xs">{invoice?.vendor}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Invoice Amount</p>
                    <p className="font-medium text-xs">{currency} {invoice?.amount}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Issue Date</p>
                    <p className="font-medium text-xs">{invoice?.issueDate}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Due Date</p>
                    <p className="font-medium text-xs">{invoice?.dueDate}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Tenor</p>
                    <p className="font-medium text-xs">{invoice?.tenor}</p>
                  </div>

                  {(status === "Approved" || status === "Rejected" ) &&
                    <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">{status} By</p>
                    <p className="font-medium text-xs">{invoice?.approvedBy}</p>
                  </div>
                  }

                </div>) :
                <div className="space-y-2 text-xs md:text-sm text-customBlack">
                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Anchor Name</p>
                    <p className="font-medium text-xs">{invoice?.anchor_name || invoice?.anchorName}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Invoice Value</p>
                    <p className="font-medium text-xs">{(invoice?.invoice_value)?.toLocaleString() ||invoice?.InvoiceValue}</p>
                  </div>

                  <div className="flex justify-between my-3">
                    <p className="font-normal text-xs">Net Amount</p>
                    <p className="font-medium text-xs">{(invoice?.net_amt)?.toLocaleString() || invoice?.netAmount}</p>
                  </div>

                  <div className="flex justify-between ">
                    <p className="font-normal text-xs">Transaction Date</p>
                    <p className="font-medium text-xs">{invoice?.transaction_date ? safeFormatDate(invoice?.transaction_date, "LLL dd, y") : invoice?.transactionDate}</p>
                  </div>
                </div>
              }
          </div>
        </CardContent>
      </Card>
    // </div>
  );
}

export default MobileCard
