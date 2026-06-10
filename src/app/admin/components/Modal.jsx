"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/admin/app/components/ui/dialog";

import { Button } from "@/admin/app/components/ui/button";

const Modal = ({
  open,
  onOpenChange,
  title = "Delete Invoice",
  description = "Are you sure you want to delete this invoice? This action is irreversible.",
  content,
  onConfirm,
  cancel = true,
  confirm = true,
  buttonText = "Yes, Delete",
  loadingText = "Processing...",
  btnType = "delete",
  isLoading = false,
  disabled = false,
  closeOnClick = true,
  contentClassName = ""
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`w-full md:w-4/10 ${contentClassName}`}>
        <DialogHeader>
          <DialogTitle className={"text-left"}>{title}</DialogTitle>
          <DialogDescription className={`${description ? "my-2" : "my-1"} text-left`}>
            {description}
          </DialogDescription>
        </DialogHeader>

        {content ? <div className="h-auto max-h-none overflow-visible">{content}</div> : null}

        {(cancel || confirm) && (
          <DialogFooter className={"flex gap-4 "}>
            {cancel && (
              <Button
                variant="outline"
                className={`${!confirm && "w-1/2 md:w-full"} h-11 text-black`}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            )}
            {confirm && (
              <Button
                className={`${!cancel && "w-1/2 md:w-full"} h-11 ${
                  (btnType === "primary" && !disabled) ? "bg-blue" : (btnType === "delete"  && !disabled) ?  "bg-[#B91C1C]" : "bg-[#A3A3A3]"
                } text-white`}
                onClick={() => {
                  onConfirm && onConfirm();
                  closeOnClick && !isLoading && onOpenChange(false);
                }}
                disabled={disabled || isLoading}
              >
                {isLoading ? loadingText : buttonText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
