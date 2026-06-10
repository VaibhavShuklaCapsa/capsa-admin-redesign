"use client";

import React from "react";
import { Card, CardContent } from "@/admin/app/components/ui/card";
import { Input } from "@/admin/app/components/ui/input";
import { Label } from "@/admin/app/components/ui/label";
import { Button } from "@/admin/app/components/ui/button";
import { currency } from '@/admin/app/constants';
import ModalLength from "./ModalLength";

const LiveDealActionModal = ({
  open = false,
  onOpenChange = () => {},
  typeOfInvoice = "Invoices", // Invoices, Revenues, Assets, Buy-Only Invoices
  mode = "placeBid", // placeBid, buyBid, editBid
  selectedInvoice = null,
  
  // Asset-specific props
  unitsToPurchase = "",
  handleUnitsChange = () => {},
  calculatedBuyNowAmount = 0,
  calculatedGrossReturns = 0,
  calculatedPlatformCharges = 0,
  calculatedNetReturns = 0,
  isFormValid = true,
  
  // Invoice/Revenue-specific props
  bidAmount = "",
  handleBidAmountChange = () => {},
  
  // Loading states
  isSubmitting = false,
  isBuyNowLoading = false,
  
  // Action handlers
  onCancel = () => {},
  onConfirm = () => {},
}) => {
  const getTitle = () => {
    if (mode === "editBid") return "Edit Bid";
    if (mode === "buyBid") return "Buy Now";
    return "Place Bid";
  };

  const getButtonLabel = () => {
    if (isSubmitting || isBuyNowLoading) return "Processing...";
    
    let prefix = "";
    if (mode === "editBid") prefix = "Update Bid to";
    else if (mode === "buyBid") prefix = "Buy Now at";
    else prefix = "Place Bid at";
    
    const amount = typeOfInvoice === "Assets"
      ? `${currency} ${(calculatedBuyNowAmount || 0).toLocaleString()}`
      : `${currency} `;
    
    return `${prefix} ${amount}`;
  };

  const isButtonDisabled = () => {
    if (isSubmitting || isBuyNowLoading) return true;
    if (typeOfInvoice === "Assets" && !isFormValid) return true;
    return false;
  };

  return (
    <ModalLength
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      description=""
      className={"p-6"}
      content={
        <div className="px-2 overflow-y-auto" style={{ maxHeight: '746px' }}>
          <div>
            {/* Divider line below title */}
            <div className="border-b border-[#E9EAEB] mb-6"></div>
            
            {/* Invoice Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="w-full max-w-3xl py-2 mx-auto rounded-sm bg-white">
                <CardContent className="space-y-3 bg-white">
                  <div>
                    <Label className="text-sm text-grey">
                      {typeOfInvoice === "Revenues"
                        ? "Revenue Number"
                        : typeOfInvoice === "Assets"
                        ? "Unit Value"
                        : "Invoice Number"}
                    </Label>
                    <p className="text-blue font-bold mt-2">
                      {selectedInvoice 
                        ? (typeOfInvoice === "Revenues"
                            ? selectedInvoice.invoice_number
                            : typeOfInvoice === "Assets"
                            ? `${currency} ${((selectedInvoice.unit_value || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : selectedInvoice.invoice_number)
                        : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full max-w-3xl py-2 mx-auto rounded-sm bg-white">
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-grey">
                      {typeOfInvoice === "Revenues"
                        ? "Revenue Value"
                        : typeOfInvoice === "Assets"
                        ? "Available Units"
                        : "Invoice Value"}
                    </Label>
                    <p className="flex text-blue font-bold mt-2">
                      {selectedInvoice
                        ? (typeOfInvoice === "Assets"
                            ? (selectedInvoice.units_available || 0).toString()
                            : `${currency} ${(selectedInvoice.invoice_value || selectedInvoice.buy_now_price || 0).toLocaleString()}`)
                        : "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asset-specific fields */}
            {typeOfInvoice === "Assets" ? (
              <>
                <div className="mb-6">
                  <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>
                    Number of units to purchase
                  </Label>
                  <div className="border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                    <Input
                      type="number"
                      placeholder={`Enter number of units (Max: ${selectedInvoice?.units_available || 0})`}
                      className="border-none"
                      value={unitsToPurchase || ""}
                      onChange={handleUnitsChange}
                      min="1"
                      max={selectedInvoice?.units_available || 0}
                      style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>Gross Returns</Label>
                  <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                    <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                    <Input
                      type="number"
                      value={calculatedGrossReturns || ""}
                      readOnly
                      className="border-none bg-gray-50"
                      placeholder="0.00"
                      style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>
                    Platform Charges
                  </Label>
                  <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                    <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                    <Input
                      type="number"
                      value={calculatedPlatformCharges || ""}
                      readOnly
                      className="border-none bg-gray-50"
                      placeholder="0.00"
                      style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>Net Returns</Label>
                  <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                    <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                    <Input
                      type="number"
                      value={calculatedNetReturns || ""}
                      readOnly
                      className="border-none bg-gray-50"
                      placeholder="0.00"
                      style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>
                    {mode === "buyBid" ? "Buy Now Price" : "Bid Amount"}
                  </Label>
                  <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                    <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="border-none"
                      value={bidAmount || ""}
                      onChange={handleBidAmountChange}
                      style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>
                    Discount Rate
                  </Label>
                  <div className="relative" style={{ height: '45px', minHeight: '36px', borderRadius: '6px' }}>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pr-8"
                      style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%', height: '45px', minHeight: '36px', padding: '10px 12px', borderRadius: '6px' }}
                    />
                    <span className="absolute right-3 top-2.5 text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>
                      %
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Gross Returns - Only show for non-Asset types */}
            {typeOfInvoice !== "Assets" && (
              <div className="mb-6">
                <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>Gross Returns</Label>
                <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                  <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="border-none"
                    style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                  />
                </div>
              </div>
            )}

            {/* Platform Charges - Only show for non-Asset types */}
            {typeOfInvoice !== "Assets" && (
              <div className="mb-6">
                <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>
                  Platform Charges
                </Label>
                <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                  <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="border-none"
                    style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                  />
                </div>
              </div>
            )}

            {/* Net Returns - Only show for non-Asset types */}
            {typeOfInvoice !== "Assets" && (
              <div className="mb-6">
                <Label className="text-grey mb-2" style={{ fontFamily: 'Satoshi', fontWeight: 500, fontSize: '18px', lineHeight: '140%', color: 'rgba(9, 9, 11, 1)' }}>Net Returns</Label>
                <div className="flex items-center gap-3 border border-[#E9EAEB] w-full px-4 rounded-md" style={{ height: '45px', minHeight: '36px', padding: '10px 12px', gap: '8px' }}>
                  <span className="text-grey" style={{ color: 'rgba(113, 113, 122, 1)' }}>{currency}</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="border-none"
                    style={{ color: 'rgba(9, 9, 11, 1)', fontFamily: 'Satoshi', fontWeight: 400, fontSize: '18px', lineHeight: '140%' }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <Button
                variant={"outline"}
                className={`text-blue h-11 cursor-pointer`}
                onClick={onCancel}
              >
                Cancel
              </Button>

              <Button
                variant={"outline"}
                className={`text-white h-11 cursor-pointer bg-blue`}
                onClick={onConfirm}
                disabled={isButtonDisabled()}
                style={{ 
                  opacity: isButtonDisabled() ? 0.6 : 1, 
                  cursor: isButtonDisabled() ? 'not-allowed' : 'pointer' 
                }}
              >
                {isSubmitting || isBuyNowLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  getButtonLabel()
                )}
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default LiveDealActionModal;
