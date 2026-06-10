import React from 'react'
import { Card, CardContent } from '../ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreVertical } from 'lucide-react'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { TooltipArrow } from '@radix-ui/react-tooltip'
import { format } from 'date-fns'
import { currency } from '@/admin/app/constants'

const InvoiceDetail = ({ invoiceData= {}, type= "invoice", showBadge = true, dropDownOption = []  }) => {
  const data = {
    invoiceNumber: 'INV389343200',
    status: 'Pending',
    anchor: 'International Breweries',
    invoiceAmount: '4,500,000',
    tenor: '30 days',
    issueDate: 'May 18th, 2025',
    dueDate: 'June 17th, 2025',
    poNumber: 'PO-2939384',
    details: 'Supply of Goods',
    dateUploaded: 'May 19th, 2025',
  }

  const StatusBadge = ({ status }) => {
    const map = {
      Pending: 'bg-amber-100 text-amber-800',
      Live: 'bg-green-100 text-green-800',
      Sold: 'bg-sky-100 text-sky-800',
    }
    const cls = map[status] || 'bg-gray-100 text-gray-700'
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${cls}`}>{status}</span>
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm border border-gray-200 py-0">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 md:mb-6">
            <div className="hidden md:flex gap-10 items-center">
              <div>
                <p className="font-semibold text-grey">Invoice Number</p>
                <h4 className="text-xl font-bold mt-1">{invoiceData?.invoice_number || invoiceData?.invoiceNumber}</h4>
              </div>
              {showBadge && <Badge
                className={`${getStatusColor(
                  invoiceData?.status
                )} px-3 py-1 rounded-full text-xs font-medium`}
              >
                {invoiceData?.status}
              </Badge>}
            </div>
            <div className="flex md:hidden items-center gap-2">
              <Image src={"/icons/document-blue.svg"} width={20} height={20} alt="bookmark"/>
              <p 
                className="font-bold text-sm"
                // onClick={() => handleClick && handleClick(invoice)}
              >
                {invoiceData?.invoice_number || invoiceData?.invoiceNumber}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 py-6 px-10"
                  >
                    Actions <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                 { dropDownOption?.map((action) => (
                    <DropdownMenuItem
                      className={`p-4 text-sm cursor-pointer ${action?.title === "Delete" ? "text-[#EF4444]" : ""}`}
                      onClick={() => action?.handleClick && action?.handleClick(invoiceData)}
                    >
                    {action?.title}
                  </DropdownMenuItem>
                ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Invoice Info Grid */}
          {type === "invoice" ? 
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border-t pt-4">
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Anchor</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.anchor}</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Invoice Amount (₦)</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.invoiceAmount}</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Tenure</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.tenor}</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Issue Date</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.issueDate}</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Due Date</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.dueDate}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-grey">Sell Now Price (₦)</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">-</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">PO Number</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData.poNumber}</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Details</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.details}</p>
              </div>
              <div className='flex md:block items-center justify-between'>
                <p className="text-sm text-grey">Date Uploaded</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.dateUploaded}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-grey flex items-center gap-1">
                  Overdue Charges
                  {/* <Image src={"/icons/information-square.svg"} width={16} height={16} alt="Information" /> */}
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
                      side="right"
                      align="start"
                      className="max-w-xs bg-gray-800 text-white rounded-md px-4 py-3 shadow-lg"
                    >
                      <TooltipArrow className="fill-gray-800" />
                      <h4 className="text-sm font-semibold mb-1">Please Note</h4>
                      <p className="text-sm leading-5 text-gray-100">You were charged this amount because your invoice was repaid after the due date. To avoid future charges, please encourage your anchor to pay on time.</p>
                    </TooltipContent>
                  </Tooltip>
                </p>
                <p className="text-xs md:text-base font-medium text-black md:text-[#EF4444]">May 19th, 2025</p>
              </div>

            </div> : 
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 border-t pt-4">
            <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Anchor</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.anchor_name || invoiceData?.anchor}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">{type !== "history" ? "Invoice Value" : `Invoice Amount (${currency})`}</p>
                <p className="font-semibold mt-0 md:mt-2">{(invoiceData?.invoice_value)?.toLocaleString() || invoiceData?.invoiceAmount}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Bid Amount ({currency})</p>
                <p className="font-semibold mt-0 md:mt-2">{(invoiceData?.bid_val)?.toLocaleString() || invoiceData?.bidAmount}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Processing Fee ({currency})</p>
                <p className="font-semibold mt-0 md:mt-2">{(invoiceData?.processing_fee)?.toLocaleString() || invoiceData?.processingFees}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Net Amount ({currency})</p>
                <p className="font-semibold mt-0 md:mt-2">{(invoiceData?.net_amt)?.toLocaleString() || invoiceData?.netAmount}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-xs md:text-sm text-grey">Tenor</p>
                <p className="text-xs md:text-base font-semibold mt-0 md:mt-2">{`${invoiceData?.tenor} days`}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Discount Rate (p.a)</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData.discountRate || invoiceData?.dis_rate} %</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Buyer Name</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.buyerName || invoiceData?.buyer_name}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">V.A.T (7.5%)</p>
                <p className="font-semibold mt-0 md:mt-2">{currency} {(invoiceData?.vat)?.toLocaleString()}</p>
              </div>
              <div className="flex md:block items-center justify-between">
                <p className="text-sm text-grey">Transaction Date</p>
                <p className="font-semibold mt-0 md:mt-2">{invoiceData?.transaction_date ? format(invoiceData?.transaction_date, 'LLL dd, y') : invoiceData?.transactionDate}</p>
              </div>
            </div>
          }
        </CardContent>
      </Card>
    </div>
  )
}

export default InvoiceDetail
