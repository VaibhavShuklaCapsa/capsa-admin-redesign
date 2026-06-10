import React from 'react';

const CustomCheckbox = ({ checked, onChange, className = '' }) => {
  return (
    <div 
      className={`relative w-4 h-4 cursor-pointer ${className}`}
      style={{
        width: '16px',
        height: '16px',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onChange && onChange(!checked);
      }}
    >
      {/* Checkbox border and background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '2px', // radius-sm
          borderWidth: '1.25px',
          borderColor: checked ? 'rgba(0, 152, 219, 1)' : 'rgba(161, 161, 170, 1)',
          backgroundColor: checked ? 'rgba(0, 152, 219, 1)' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      />
      
      {/* Check mark - only visible when checked */}
      {checked && (
        <svg
          style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            width: '12px',
            height: '12px',
          }}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 6L4.5 8L9.5 3"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      
      {/* Hidden native checkbox for form accessibility */}
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {}}
        style={{
          position: 'absolute',
          opacity: 0,
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
      />
    </div>
  );
};

export default CustomCheckbox;
