import React from 'react'
import { Card, CardContent } from "@/admin/app/components/ui/card";
import { Badge } from "@/admin/app/components/ui/badge";
import Image from "next/image";
import { Button } from "@/admin/app/components/ui/button";
import { currency } from '@/admin/app/constants';

export default function DealsCard({
  anchor,
  type,
  invoice,
  handleReview,
  pendingPayment = false,
  setPlaceBid,
  handleBuyNow,
  dealsType = "Invoices",
  handlePayment,
  showBuyNowButton = true
}) {
  // Determine which buttons to show based on buttonStatus
  const getButtonVisibility = () => {
    const buttonStatus = invoice?.buttonStatus;
    
    return {
      showPlaceBid: buttonStatus === "showPlaceBid",
      showPayButton: buttonStatus === "showPayButton",
      showViewDetails: true  // Always show View Details
    };
  };
  
  const { showPlaceBid, showPayButton, showViewDetails } = getButtonVisibility();
  return (
      <Card className="w-full rounded-2xl border border-customWhite shadow-sm hover:shadow-md transition-shadow py-2">
        <CardContent className="px-4 md:px-6 py-2 md:py-4 space-y-0 md:space-y-4">
                <div>
                    <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-backgroundBlue flex items-center justify-center font-semibold text-blue">
                        {invoice?.anchor_initials || "IB"}
                        </div>
                        <div>
                        {/* Display seller/guarantor name for Revenues/Assets, customer name for others */}
                        <p className="font-semibold text-customBlack">{dealsType === "Revenues" ? (invoice?.sellerName || invoice?.anchor) : dealsType === "Assets" ? (invoice?.guarantorName || invoice?.anchor) : (invoice?.customerName || invoice?.anchor_display || invoice?.anchor)}</p>
                            <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-grey font-medium">
                                {
                                dealsType === "Revenues" ? 
                                    invoice?.revenueNo : 
                                dealsType === "Assets" ? 
                                    invoice?.assetType :
                                invoice?.invoiceNo}
                            </p>
                            {/* CAC/CIN Number below customer name - Only for Invoices tabs */}
                            {(dealsType === "Invoices" || dealsType === "Buy-Only Invoices") && invoice?.cacNumber && (
                                <span className="text-xs text-grey ml-2 border-l border-grey pl-2">
                                    {invoice.cacNumber}
                                </span>
                            )}
                        </div>
                        </div>
                    </div>

                    <Badge className={`${type !== "Vendor" ? "text-purple-700 bg-purple-100" : "text-[#196C26] bg-[#EBF8ED]"} font-medium`}>
                        {type}
                    </Badge>
                    </div>

                    <div className="py-2 border-b border-[#E9EAEB] border-dashed">
                        {dealsType ==="Invoices" || dealsType === "Buy-Only Invoices" ? 
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Invoice Value</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.invoiceValue}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Tenor</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.tenure || invoice?.tenor}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Buy Now Price</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.buyNowPrice ? currency + " " + invoice?.buyNowPrice?.toLocaleString() : 
                                     invoice?.buy_now_price ? currency + " " + invoice?.buy_now_price?.toLocaleString() : "-"}
                                </span>
                                </div>

                            </div> :
                        dealsType === "Revenues" ?
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Revenue Value</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.revenueValue}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Term Length</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.tenor || "-"}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Buy Now Price</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.investmentAmount || "-"}
                                </span>
                                </div>

                            </div> : 
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Unit Value</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.unitValue}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Available Units</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.unitsAvailable}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Term Length</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.tenor || ""}
                                </span>
                                </div>

                                <div className="flex justify-between mb-3">
                                <span className="text-grey">Expected Returns</span>
                                <span className="font-semibold text-customBlack">
                                    {invoice?.discountRate || "-"}
                                </span>
                                </div>

                            </div>
                        }

                    {/* Hyperlinked "Buy Now" text inside card - Only for Invoices and Revenues tabs */}
                    {(dealsType === "Invoices" || dealsType === "Revenues") && showBuyNowButton && (
                      <button
                        className={`flex items-center gap-1 text-blue font-bold text-sm hover:underline mt-3 cursor-pointer`}
                        onClick={() => handleBuyNow(invoice)}
                        >
                            Buy Now
                        <Image
                            src={"/icons/arrow-right.svg"}
                            width={20}
                            height={20}
                            alt="view"
                        />
                      </button>
                    )}
                    </div>

                    {dealsType === "Buy-Only Invoices" ? (
                      // Buy-Only mode: Show View Details + Buy Now buttons side by side
                      <div className="flex justify-end gap-4 font-bold mt-4">
                        {/* Buy Now Button - Full UI button */}
                        {showBuyNowButton && (
                          <Button 
                            variant={"outline"}
                            className="text-blue h-11 cursor-pointer"
                            onClick={() => handleBuyNow(invoice)}
                          >
                            Buy Now
                          </Button>
                        )}
                        
                        {/* View Details Button - ALWAYS visible */}
                        <Button 
                          variant={"outline"}
                          className="bg-blue text-white h-11 cursor-pointer"
                          onClick={() => handleReview(invoice)}
                        >
                          View Details
                        </Button>
                      </div>
                    ) : dealsType === "Invoices" || dealsType === "Revenues" ? (
                      // Regular mode: Buttons controlled by buttonStatus
                      <div className="flex justify-end gap-4 font-bold mt-4">
                        {/* Place Bid Button - Only when buttonStatus is "showPlaceBid" */}
                        {showPlaceBid && (
                          <Button 
                            variant={"outline"}
                            className="text-blue h-11 cursor-pointer"
                            onClick={() => setPlaceBid(invoice)}
                          >
                            Place Bid
                          </Button>
                        )}

                        {/* Make Payment Button - Only when buttonStatus is "showPayButton" */}
                        {showPayButton && (
                          <Button 
                            variant={"outline"}
                            className="bg-[#059669] text-white h-11 cursor-pointer"
                            onClick={() => handlePayment(invoice)}
                          >
                            Make Payment
                          </Button>
                        )}

                        {/* View Details Button - ALWAYS visible */}
                        {showViewDetails && (
                          <Button 
                            variant={"outline"}
                            className="bg-blue text-white h-11 cursor-pointer"
                            onClick={() => handleReview(invoice)}
                          > 
                            View Details
                          </Button>
                        )}
                      </div>
                    ) : dealsType === "details" ? null : (
                      // Assets tab: Show View Details + Buy Now buttons side by side
                      <div className="flex justify-end gap-4 font-bold mt-4">
                        {/* Buy Now Button - Full UI button */}
                        {showBuyNowButton && (
                          <Button 
                            variant={"outline"}
                            className="text-blue h-11 cursor-pointer"
                            onClick={() => handleBuyNow(invoice)}
                          >
                            Buy Now
                          </Button>
                        )}
                        
                        {/* View Details Button - ALWAYS visible */}
                        <Button 
                          variant={"outline"}
                          className="bg-blue text-white h-11 cursor-pointer"
                          onClick={() => handleReview(invoice)}
                        > 
                          View Details
                        </Button>
                      </div>
                    )}
            </div>
            </CardContent>
        </Card>
  )  
}
