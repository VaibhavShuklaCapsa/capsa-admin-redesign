"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/ui/dropdown-menu";
import { Download, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/app/components/Modal";
import { currency, getStatusColor, handleDownload } from "@/app/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { format } from "date-fns";

// Helper function to safely parse and format dates
const safeFormatDate = (dateValue, dateFormat = "LLL dd, y") => {
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

const InvoiceDetailsCard = ({
  type = "Invoice",
  openModal,
  setOpenModal,
  handleEdit,
  dropDown = [],
  status = "Pending",
  delayed = "",
  data,
  file = {},
  onDelete = () => {},
  onDownload = null,
  revenueData,
  isLoading = false,
  deleteLoading = false,
  onDownloadContract = null,
}) => {
  // Use revenueData if type is "Revenues", otherwise use data
  const displayData = type === "Revenues" ? revenueData : data;
  const revenueHasPendingActions =
    type === "Revenues" &&
    displayData?.status?.toString().toLowerCase() === "pending";
  const showActionDropdown =
    type === "Invoice" ||
    type === "Anchor" ||
    type === "Invoices" ||
    revenueHasPendingActions;
  
  return (
    <div>
      <Card className="rounded-2xl shadow-sm border border-gray-200 py-0 ">
        <CardContent className="p-6">
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-2 ${
              type === "Revenues" || type === "Invoices" ? "md:mb-6" : "md:mb-2"
            }`}
          >
            <div className="flex gap-10 items-center">
              <div className="flex md:block gap-2 items-center">
                <Image
                  src={"/icons/document-blue.svg"}
                  width={20}
                  height={20}
                  alt="bookmark"
                  className="block md:hidden"
                />
                <p className="hidden md:block font-semibold text-grey">
                  {type === "Revenues" ? "Revenue " : type === "Assets" ? "Series Details" : "Invoice "}Number
                </p>
                <h4 className="text-sm md:text-xl font-bold mt-0 md:mt-1">
                  {type === "Assets" 
                    ? "Sovereign Debt Notes Series I" 
                    : type === "Revenues"
                      ? displayData?.revenue_no || "N/A"
                      : data?.invoice_number || "N/A"}
                </h4>
              </div>
              <Badge
                className={`${getStatusColor(
                  type === "Revenues" ? displayData?.status : status
                )} hidden md:block px-3 py-1 rounded-full text-xs font-medium`}
              >
                {type === "Revenues" ? displayData?.status || "N/A" : status}
              </Badge>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="">
                {showActionDropdown && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 py-6 px-10"
                      >
                        <p className="hidden md:flex">Actions</p>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    {type === "Invoice" ? (
                      <>
                        <DropdownMenuItem
                          className={"p-4 text-sm cursor-pointer"}
                          onClick={() => {
                            if (onDownload) {
                              onDownload();
                              return;
                            }
                            file?.url && handleDownload(file?.url, data?.invoice_file);
                          }}
                        >
                          Download Invoice Document
                        </DropdownMenuItem>
                        <hr />
                      </>
                    ) : null}
                    {type === "Invoices" ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleEdit(data?.invoice_number || data?.id)} 
                          className={"p-4 text-sm cursor-pointer"}
                        >
                          Edit Revenue
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            "p-4 text-sm cursor-pointer text-[#EF4444]"
                          }
                          onClick={() => {setOpenModal(true)}}
                        >
                          Delete Revenue
                        </DropdownMenuItem>
                      </>
                    ) : type === "Revenues" ? (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleEdit?.(displayData?.revenue_number || displayData?.id)}
                          className={"p-4 text-sm cursor-pointer"}
                        >
                          Edit Revenue
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            "p-4 text-sm cursor-pointer text-[#EF4444]"
                          }
                          onClick={() => {setOpenModal(true)}}
                        >
                          Delete Revenue
                        </DropdownMenuItem>
                      </>
                    ) : (
                      dropDown?.length > 0 &&
                      dropDown?.map((action) => (
                        <DropdownMenuItem
                          key={action?.title}
                          onClick={() => action?.handleClick()}
                          className={`p-4 text-sm cursor-pointer ${
                            action?.display ? "block" : "hidden"
                          } ${
                            action?.title.includes("Cancel") || action?.title.includes("Delete")
                              ? "text-[#EF4444]"
                              : "text-customBlack"
                          }`}
                        >
                          {action?.title}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              </div>
            </div>
            <Badge
              className={`${getStatusColor(
                type === "Revenues" ? displayData?.status : status
              )} block md:hidden px-3 py-1 rounded-full text-xs font-medium`}
            >
              {type === "Revenues" ? displayData?.status || "N/A" : status}
            </Badge>
          </div>

          {type === "Transactions" && (
            <p className=" mb-4">
              {status === "Open"
                ? "This invoice is due to be paid out in 9 days. This invoice is eligible for sale on secondary market"
                : status === "Listed"
                ? "Invoice Listed on Secondary Market"
                : ""}
            </p>
          )}

          {type === "Assets" && (
            <p className=" mb-4">
              {status === "Open"
                ? "Awaiting payment from Normal Anchor"
                : status === "Listed"
                ? "Invoice Listed on Secondary Market"
                : ""}
            </p>
          )}

          {type === "Recurring Revenue" && (
            <p className=" mb-4">
              {status === "Open"
                ? "Awaiting Payment from Sterling Bank"
                : status === "Listed"
                ? "Revenue listed in Secondary Market"
                : ""}
            </p>
          )}

          {/* Invoice Info Grid */}
          {type === "Invoice" ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Anchor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.anchor_name || data?.customer_name || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">{`Invoice Amount (${currency})`}</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.invoice_amount || data?.invoice_value)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Tenure
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.tenor || data?.payment_terms) ? `${data?.tenor || data?.payment_terms} days` : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Issue Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                 {data?.issue_date ? safeFormatDate(data?.issue_date, "LLL dd, y") : data?.invoice_date ? safeFormatDate(data?.invoice_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Due Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                 {data?.due_date ? safeFormatDate(data?.due_date, "LLL dd, y") : data?.invoice_due_date ? safeFormatDate(data?.invoice_due_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">{`Sell Now Price (${currency})`}</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.sell_now_price || data?.ask_amt) ? (data?.sell_now_price || data?.ask_amt).toLocaleString() : "-"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  PO Number
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.po_number || data?.invoice_line_items || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Details
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.details || data?.description || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Date Uploaded
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.uploaded_date ? safeFormatDate(data?.uploaded_date, "LLL dd, y") : data?.created_at ? safeFormatDate(data?.created_at, "LLL dd, y") : "N/A"}
                </p>
              </div>
            </div>
          ) : type === "Transactions" ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Anchor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.customer_name || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Vendor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.companyName || data?.sel_key_person || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">{`Invoice Value (${currency})}`}</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.invoice_value || data?.invoice_amount)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Tenor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.tenor ? `${data.tenor} days` : (data?.description ? `${data.description} days` : "N/A")}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Transaction Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.start_date || data?.issue_date ? safeFormatDate(data.start_date || data.issue_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Bid Amount {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.prop_amt)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Processing Fee {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.processing_fee)?.toLocaleString() || (status === "Sold" || status === "Closed" ? "20,000" : "-")}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Net Returns {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.net_returns ? (data.net_returns).toLocaleString() : (status === "Sold" || status === "Closed" ? "4,480,000" : "-")}
                </p>
              </div>

              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Discount Rate
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.discount_percentage ? `${data.discount_percentage}%` : (status === "Sold" || status === "Closed" ? "4.3%" : "-")}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  {status === "Sold" || status === "Closed"
                    ? "Gains"
                    : "Profit"}{" "}
                  {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.profit || data?.gains ? (data.profit || data.gains).toLocaleString() : (data?.invoice_value && data?.prop_amt ? ((data.invoice_value - data.prop_amt).toLocaleString()) : (status === "Sold" || status === "Closed" ? "180,000" : "-"))}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Due Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.due_date ? safeFormatDate(data.due_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Repayment Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.repayment_date ? safeFormatDate(data.repayment_date, "LLL dd, y") : (status === "Sold" || status === "Closed" ? "May 21st, 2025" : "-")}
                </p>
              </div>
             {delayed && status === "Closed" ?
              <>
                <div className="flex md:block items-center justify-between">
                  <p className="text-xs md:text-sm text-customBlack md:text-grey">
                    {delayed === "delayed" ? "Delay Period" : "Advance Period"}
                  </p>
                  <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                    {data?.delay_days || data?.advance_days || "32"} Days
                  </p>
                </div>
                <div className="flex md:block items-center justify-between">
                  <p className="flex items-center gap-2 text-xs md:text-sm text-customBlack md:text-grey">
                    {delayed === "delayed" ? "Advanced Deductions" : "Delay Returns"}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Overdue info"
                         className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                        >
                          <Image
                            src="/icons/information-square.svg"
                           alt="info"
                           width={16}
                           height={16}
                          />
                        </button>
                      </TooltipTrigger>

                      <TooltipContent
                        side="top"
                       align="start"
                       className="max-w-xs bg-gray-800 text-white rounded-md px-4 py-3 shadow-lg"
                      >
                        <TooltipArrow className="fill-gray-800" />
                        <h4 className="text-sm font-semibold mb-1">
                          Please Note
                        </h4>
                        <p className="text-sm leading-5 text-gray-100">
                          {delayed === "delayed" ? "You received an extra amount because your invoice was repaid after the due date." : "Your returns were adjusted since this invoice was settled earlier than expected."}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                  <p className={`text-xs md:text-base font-semibold mt-0 md:mt-2 ${delayed === "delayed" ? "text-[#047857]" : "text-[#EF4444]"}`}>
                    {currency} {(data?.delay_amount || data?.advance_amount || 85900).toLocaleString()}
                  </p>
                </div>
              </> : null}
            </div>
          ) : 
          type === "Anchor" ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Vendor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.customer_name || data?.vendor_name || data?.uploader_name || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">{`Invoice Value (${currency})`}</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.invoice_value || data?.invoice_amount || data?.actual_value)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Tenor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.tenor || data?.payment_terms) ? `${data?.tenor || data?.payment_terms} days` : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Issue Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.invoice_date ? safeFormatDate(data.invoice_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
               <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Due Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.invoice_due_date ? safeFormatDate(data.invoice_due_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Purchase Order Number
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.invoice_line_items || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Discount Rate
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.ask_rate ? `${data.ask_rate}%` : (data?.discount_percentage ? `${data.discount_percentage}%` : "N/A")}
                </p>
              </div>
            </div>
          ) :
          type === "Assets" ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Revenue Number
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.revenue_number || data?.series_details || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Seller Name
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.seller_details?.name || data?.seller_name || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Asset Size ({currency})
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.revenue_value)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Unit Value ({currency})
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.unit_value)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Total Units
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.total_units)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Units Available
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {(data?.units_available)?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Returns
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.returns ? `${data.returns}%` : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Start Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.start_date ? safeFormatDate(data.start_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Maturity Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.maturity_date ? safeFormatDate(data.maturity_date, "LLL dd, y") : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Tenor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.tenor ? `${Math.round(data.tenor * 365)} days` : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Asset Backed By
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.asset_backed_by || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Ratings
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.ratings ? `${data.ratings}/5` : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Payment Day
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.payment_day ? `Day ${data.payment_day}` : "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Seller Industry
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.seller_details?.industry || data?.seller_industry || "N/A"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Seller Key Person
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {data?.seller_details?.key_person || data?.seller_key_person || "N/A"}
                </p>
              </div>
            </div>
          ):
          type === "Recurring Revenue" ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Seller
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  Capsa Technologies
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Revenue Value ({currency})
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  4,500,000
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">Term Length</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  12 Months
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Interval
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  1 Month
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Transaction Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  May 18th, 2025
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Bid Amount {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  4,300,000
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Processing Fee {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {status === "Sold" || status === "Closed" ? "20,000" : "-"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Net Returns {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {status === "Sold" || status === "Closed"
                    ? "4,480,,000"
                    : "-"}
                </p>
              </div>

              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Discount Rate
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {status === "Sold" || status === "Closed" ? "4.3%" : "-"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  {status === "Sold" || status === "Closed"
                    ? "Gains"
                    : "Profit"}{" "}
                  {`(${currency})`}
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {status === "Sold" || status === "Closed" ? "180,000" : "-"}
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  End Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  May 21st, 2025
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Repayment Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  {status === "Sold" || status === "Closed"
                    ? "May 21st, 2025"
                    : "-"}
                </p>
              </div>
            </div>
          ) :
          type === "Revenues" ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              {isLoading ? (
                <div className="col-span-5 flex items-center justify-center py-8">
                  <Image src={"/images/loader.gif"} width={100} height={100} alt="Loading..." />
                </div>
              ) : displayData ? (
                <>
                 <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Revenue Value (₦)
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.revenue_value || "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Tenor
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.tenor || "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Interval
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {(displayData?.interval)?.toLocaleString() || "0"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Start Date
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.created_at ? safeFormatDate(displayData.created_at, "LLL dd, y") : "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                      <p className="text-xs md:text-sm text-customBlack md:text-grey">
                        End Date
                      </p>
                      <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                        {displayData?.end_date ? safeFormatDate(displayData.end_date, "LLL dd, y") : "N/A"}
                      </p>
                    </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Transaction Date
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.trxn_date ? safeFormatDate(displayData.trxn_date, "LLL dd, y") : "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Sell Now Price (₦)
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                     {displayData?.sell_now_price || "N/A"}
                    </p>
                  </div>
                  {/* <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Payment Interval
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.interval === 1 ? "Monthly" : displayData?.interval === 3 ? "Quarterly" : displayData?.interval === 6 ? "Semi-Annual" : "Annual"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Payment Date
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.payment_date || "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Seller RC
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.seller_RC || "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Seller Industry
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.seller_industry || "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Seller Key Person
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.seller_key_person || "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Seller Founded
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.seller_founded ? safeFormatDate(displayData.seller_founded, "LLL dd, y") : "N/A"}
                    </p>
                  </div>
                  <div className="flex md:block items-center justify-between">
                    <p className="text-xs md:text-sm text-customBlack md:text-grey">
                      Days Remaining
                    </p>
                    <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                      {displayData?.days_remaining || "N/A"} days
                    </p>
                  </div> */}
                </>
              ) : (
                <div className="col-span-5 flex items-center justify-center py-8">
                  <p className="text-lg font-medium text-gray-600">Revenue data not available</p>
                </div>
              )}
            </div>
          ) :
          (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t pt-4">
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Revenue Value (₦)
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  5,500,000
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Tenor
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  12 Months
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Interval
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  1 Month
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Start Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  Oct 31, 2024
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  End Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  Oct 31, 2025
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Transaction Date
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  Nov 14, 2024
                </p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-customBlack md:text-grey">
                  Sell Now Price (₦)
                </p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">
                  -
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {type !== "Revenues" && type !== "Anchor" ? (
        <Card className="rounded-2xl shadow-sm border border-gray-200 mt-10">
          <CardContent className="px-4 md:px-6">
            {/* Uploaded Document Section */}

            <div className="">
              <p className="font-semibold mb-3 text-grey">
                {type === "Invoice"
                  ? "Invoice Document Uploaded" :
                type === "Assets" ? 
                  "Assets Contract": 
                type === "Recurring Revenue" ?
                  "Revenue Contract" :
                  "Invoice Contract"}
              </p>
              {type === "Assets" && data?.asset_document ?
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-10 p-0 md:p-3">
                <div className="flex flex-col gap-2 bg-[#F4F4F5] p-6 xl:p-10 rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-5 w-9/10 md:w-full">
                      <Image
                        src={"/icons/document-2.svg"}
                        width={20}
                        height={20}
                        alt="document icon"
                        className="cursor-pointer"
                      />
                      <span className="text-sm text-grey break-words w-3/5 not-even:md:w-3/4 ">
                        {data?.asset_document}
                      </span>
                    </div>
                    <Image
                      src={"/icons/download-circle-01.svg"}
                      width={20}
                      height={20}
                      alt="download icon"
                      onClick={() => handleDownload(data?.asset_download_url)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" className={"hidden"}>
                  Download
                </Button>
              </div> : type === "Assets" ?
              <p className="text-center text-xl text-medium">No asset document uploaded </p> :
              data?.invoice_file ?
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 xl:gap-10 p-0 md:p-3">
                <div className="flex flex-col gap-2 bg-[#F4F4F5] p-6 xl:p-10 rounded-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-5 w-9/10 md:w-full">
                      <Image
                        src={"/icons/document-2.svg"}
                        width={20}
                        height={20}
                        alt="document icon"
                        className="cursor-pointer"
                      />
                      <span className="text-sm text-grey break-words w-3/5 not-even:md:w-3/4 ">
                        {data?.invoice_file}
                      </span>
                    </div>
                    <Image
                      src={"/icons/download-circle-01.svg"}
                      width={20}
                      height={20}
                      alt="download icon"
                      onClick={() => handleDownload(file?.url)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm" className={"hidden"}>
                  Download
                </Button>
              </div>: 
              <p className="text-center text-xl text-medium">No file uploaded </p>
              }
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Revenue Contract Download Section - NEW */}
      {type === "Revenues" && displayData?.deal_id && (
        <Card className="rounded-2xl shadow-sm border border-gray-200 mt-10">
          <CardContent className="px-4 md:px-6">
            <div className="">
              <p className="font-semibold mb-3 text-grey">
                Revenue Contract
              </p>
              <div className="flex items-center justify-between gap-3 p-6 bg-[#F4F4F5] rounded-lg">
                <div className="flex items-center gap-5">
                  <Image
                    src={"/icons/document-2.svg"}
                    width={20}
                    height={20}
                    alt="document icon"
                  />
                  <span className="text-sm text-grey">
                    Purchase Agreement - {displayData?.revenue_no || "Revenue"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("🔵 [InvoiceDetailsCard] Download button clicked!");
                    console.log("🔵 [InvoiceDetailsCard] onDownloadContract:", onDownloadContract);
                    console.log("🔵 [InvoiceDetailsCard] onDownloadContract type:", typeof onDownloadContract);
                    console.log("🔵 [InvoiceDetailsCard] onDownloadContract keys:", Object.keys(onDownloadContract || {}));
                    console.log("🔵 [InvoiceDetailsCard] dealId:", displayData?.deal_id);
                    if (typeof onDownloadContract === 'function') {
                      console.log("🔵 [InvoiceDetailsCard] Calling onDownloadContract...");
                      onDownloadContract();
                    } else {
                      console.error("❌ [InvoiceDetailsCard] onDownloadContract is not a function!");
                      console.error("❌ [InvoiceDetailsCard] Actual value:", JSON.stringify(onDownloadContract, null, 2));
                    }
                  }}
                  className="flex items-center gap-2 text-blue hover:underline cursor-pointer"
                >
                  <Image
                    src={"/icons/download-circle-01.svg"}
                    width={20}
                    height={20}
                    alt="download icon"
                  />
                  <span className="text-sm font-medium">Download Contract</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Debug: Check if section should render */}
      {type === "Revenues" && process.env.NODE_ENV === 'development' && (
        <div style={{display: 'none'}}>
          {console.log("🔍 [Debug] Revenue type:", type)}
          {console.log("🔍 [Debug] displayData:", displayData)}
          {console.log("🔍 [Debug] displayData.deal_id:", displayData?.deal_id)}
          {console.log("🔍 [Debug] Should render section:", !!displayData?.deal_id)}
        </div>
      )}

      {openModal && (
        <Modal
          open={openModal}
          onOpenChange={setOpenModal}
          title={`Delete ${type === "Revenues" ? "Revenune" : "Invoice"}`}
          description={`Do you wish to proceed to delete this ${
            type === "Revenues" ? "revenune" : "invoice"
          }. This action is irreversible`}
          onConfirm={onDelete}
          isLoading={deleteLoading}
          loadingText={type === "Revenues" ? "Deleting revenue..." : "Deleting invoice..."}
          disabled={deleteLoading}
          closeOnClick={!deleteLoading}
        />
      )}
    </div>
  );
};

export default InvoiceDetailsCard;
