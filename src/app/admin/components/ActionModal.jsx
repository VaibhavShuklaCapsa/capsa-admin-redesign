"use client";

import * as React from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/admin/app/components/ui/button";

const ActionModal = ({
  type = "confirmation", // 'confirmation' or 'success'
  title = "",
  description = "",
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
}) => {
  const [isVisible, setIsVisible] = React.useState(isOpen);
  const [shouldRender, setShouldRender] = React.useState(isOpen);

  // Handle animation timing
  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger enter animation
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Wait for exit animation before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const isConfirmation = type === "confirmation";
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with backdrop blur */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className={`relative z-50 w-full max-w-[400px] mx-4 bg-white rounded-[var(--radius-md, 6px)] border border-gray-200 shadow-2xl transform transition-all duration-300 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{
          width: '400px',
          height: '380px',
          borderRadius: 'var(--radius-md, 6px)',
          borderWidth: '1px',
          padding: 'var(--padding-lg, 24px)',
          gap: '24px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Container */}
        <div className={`h-full flex flex-col ${isSuccess ? "text-center" : "text-left"}`} style={{ padding: '24px', gap: '16px' }}>
          {/* Success Icon */}
          {isSuccess && (
            <div className="flex justify-center" style={{ marginBottom: '24px' }}>
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-64 h-64 text-[#059669]" />
              </div>
            </div>
          )}

          {/* Title & Description - Grow to fill space */}
          <div className="flex-grow flex flex-col justify-center" style={{ gap: '24px' }}>
            {/* Title */}
            {title && (
              <h2
                id="modal-title"
                className="text-center"
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 700,
                  fontStyle: 'Bold',
                  fontSize: '24px',
                  lineHeight: '110.00000000000001%',
                  letterSpacing: '-2%',
                  color: 'rgba(9, 9, 11, 1)'
                }}
              >
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p
                id="modal-description"
                className="text-center"
                style={{
                  fontFamily: 'Satoshi',
                  fontWeight: 400,
                  fontStyle: 'Regular',
                  fontSize: '16px',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  color: 'rgba(9, 9, 11, 1)'
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`${
              isSuccess
                ? "flex flex-col gap-3"
                : "flex justify-end gap-3"
            }`}
          >
            {isConfirmation && (
              <>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-[#D1D5DB] px-6 py-3 h-auto hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="bg-[#00AEEF] text-white px-6 py-3 h-auto hover:bg-[#0095CC] transition-colors"
                >
                  Yes, Proceed
                </Button>
              </>
            )}

            {isSuccess && (
              <Button
                onClick={onClose}
                className="w-full bg-[#00AEEF] text-white px-6 py-3 h-auto hover:bg-[#0095CC] transition-colors"
              >
                Okay
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
