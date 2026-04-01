'use client';

import React, { forwardRef } from 'react';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder = "Enter 10 digit mobile number", className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, ''); // Only digits
      if (input.length <= 10) {
        onChange(input);
      }
    };

    return (
      <div className={`relative ${className}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm pointer-events-none">
          +91
        </div>
        <input
          ref={ref}
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={10}
          className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;