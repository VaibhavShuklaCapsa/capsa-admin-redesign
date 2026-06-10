"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/admin/app/components/ui/dialog";

import { Button } from "@/admin/app/components/ui/button";

/**
 * Custom confirmation modal for bulk invoice actions (Verify/Approve)
 * Matches design specifications with white background, gray border, and blue confirm button
 */
const BulkActionModal = ({
  open,
  onOpenChange,
  title = "Verify Selected Invoices",
  description = "You are choosing to verify the selected invoices. Do you wish to proceed?",
  confirmButtonText = "Yes, Proceed",
  cancelButtonText = "Cancel",
  onConfirm,
  isLoading = false
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className={`w-full md:w-[451px] max-h-none overflow-visible`}
        style={{
          width: '451px',
          height: '189px',
          gap: '',
          borderRadius: 'var(--radius-md, 8px)',
          borderWidth: '1px',
          padding: 'var(--padding-lg, 24px)',
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(228, 228, 231, 1)'
        }}
      >
        {/* Close Icon Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer p-0"
          style={{
            background: 'none',
            border: 'none'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#6B7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <DialogHeader>
          {/* Header Text */}
          <div
            className="text-left mb-3"
            style={{
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: '700',
              fontStyle: 'Bold',
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '0%',
              color: 'rgba(9, 9, 11, 1)',
              marginTop: '0',
              marginBottom: '8px'
            }}
          >
            {title}
          </div>

          {/* Body Text */}
          <div
            className="text-left"
            style={{
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '14px',
              fontWeight: '400',
              fontStyle: 'Regular',
              color: 'rgba(113, 113, 122, 1)',
              lineHeight: '140%',
              letterSpacing: '0%',
              marginBottom: ''
            }}
          >
            {description}
          </div>
        </DialogHeader>

        {/* Action Button Row */}
        <div
          className="flex justify-end gap-4"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '0',
            marginBottom: '24px'
          }}
        >
          {/* Cancel Button (Outline Style) */}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="h-[44px]"
            style={{
              width: '83px',
              height: '44px',
              gap: '8px',
              borderRadius: 'var(--radius-md, 8px)',
              borderWidth: '1px',
              paddingTop: 'var(--padding-xxs, 4px)',
              paddingRight: 'var(--padding-sm, 12px)',
              paddingBottom: 'var(--padding-xxs, 4px)',
              paddingLeft: 'var(--padding-sm, 12px)',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: '500',
              fontStyle: 'Medium',
              fontSize: '16px',
              lineHeight: '140%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              border: '1px solid #D1D5DB',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {cancelButtonText}
          </Button>

          {/* Confirm Button (Contained Style - Blue) */}
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="h-[44px]"
            style={{
              width: '126px',
              height: '44px',
              gap: '8px',
              borderRadius: 'var(--radius-md, 8px)',
              paddingTop: 'var(--padding-xxs, 4px)',
              paddingRight: 'var(--padding-sm, 12px)',
              paddingBottom: 'var(--padding-xxs, 4px)',
              paddingLeft: 'var(--padding-sm, 12px)',
              backgroundColor: isLoading ? 'rgba(163, 163, 163, 1)' : 'rgba(0, 152, 219, 1)',
              color: '#FFFFFF',
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: '500',
              fontStyle: 'Medium',
              fontSize: '16px',
              lineHeight: '140%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Processing...' : confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkActionModal;
