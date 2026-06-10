"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"

import { Button } from "./ui/button"

const  ModalLength = ({ open, onOpenChange, title = "Success", description = "The operation completed successfully.", onClose, content, className }) =>{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`gap-2 w-full max-w-[652px] overflow-x-hidden ${className || ''}`}
        style={{ 
          borderRadius: '6px',
          paddingTop: '16px',      // Top padding (before header)
          paddingRight: '24px',     // Right padding
          paddingBottom: '16px',    // Bottom padding (after footer)
          paddingLeft: '24px',      // Left padding
          maxHeight: '90vh',        // Maximum height (90% of viewport)
          overflowY: 'auto'         // Enable scrolling if content exceeds maxHeight
        }}
      >
        {/* 
          SPACING EXPLANATION:
          ===================
          CONTROLLED FROM MODALLENGTH ONLY:
          1. Top padding before header: "paddingTop: 24px" (line 21)
          2. Right padding: "paddingRight: 24px" (line 22)
          3. Bottom padding after footer: "paddingBottom: 24px" (line 23)
          4. Left padding: "paddingLeft: 24px" (line 24)
          5. Gap between components: "gap-3" (12px) on line 18
          6. Divider margin: "my-3" (12px) on line 51
          7. Max dialog height: "maxHeight: 90vh" (line 25)
          
          TO ADJUST SPACING:
          - Change paddingTop/Right/Bottom/Left (lines 21-24) for individual side padding
          - Change "gap-3" on line 18 for spacing between components (gap-2=8px, gap-3=12px, gap-4=16px)
          - Change "my-3" on line 51 for divider spacing (my-2=8px, my-3=12px, my-4=16px)
          - Change "maxHeight: 90vh" on line 25 for dialog height (e.g., 80vh, 700px, etc.)
          
          TEXT STYLING (Labels & Input Text):
          ====================================
          All labels in content should use:
          - fontFamily: 'var(--font-satoshi-custom)'
          - fontWeight: 500 (Medium)
          - fontSize: '18px'
          - lineHeight: '140%'
          - letterSpacing: '0%'
          - color: 'rgba(9, 9, 11, 1)'
          
          All input/user-entered text should use:
          - fontFamily: 'var(--font-satoshi-custom)'
          - fontWeight: 400 (Regular)
          - fontSize: '18px'
          - lineHeight: '140%'
          - color: 'rgba(113, 113, 122, 1)' (grey)
        */}
        <DialogHeader>
                    <DialogTitle
              className="text-left"
              style={{
                fontFamily: 'var(--font-satoshi-custom)',
                fontWeight: 700,
                fontSize: '18px',
                lineHeight: '140%',
                letterSpacing: '0%',
                color: 'rgba(9, 9, 11, 1)',
              }}
            >
              {title}
            </DialogTitle>
          <DialogDescription className={"text-left"}>{description}</DialogDescription>
        </DialogHeader>

        {/* Divider line - spacing controlled by "my-3" (12px top & bottom) */}
        <div className="w-full h-px bg-[rgba(233,234,235,1)] my-2"></div>

        <div>
          {content}
        </div>

        <DialogFooter>
          {/* <Button variant="default" onClick={() => { onClose && onClose(); onOpenChange(false); }}>OK</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalLength
