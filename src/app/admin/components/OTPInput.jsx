"use client";
import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";


export function OtpInput({ length = 6, onComplete }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow single digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next field
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Trigger callback when OTP complete
    if (newOtp.join("").length === length && !newOtp.includes("")) {
      onComplete && onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-start gap-3">
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={cn(
            "w-12 h-12 text-center text-lg font-medium rounded-xl border border-gray-300 focus-visible:ring-2 focus-visible:ring-primary transition-all",
            "focus:border-primary focus:ring-primary"
          )}
        />
      ))}
    </div>
  );
}

