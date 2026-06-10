import React from 'react'

const Button = ({text, handleClick, loading = false, disabled}) => {
  return (
    <div>
      <button
        type="button"
        className={`w-full rounded-md ${disabled || loading ? "bg-grey opacity-30" : "bg-customBlue"} p-4 text-white text-sm font-medium cursor-pointer`}                    
        onClick={() => handleClick()}
        disabled={disabled || loading}
      >
          {loading ? "Processing..." : text}

        </button>
    </div>
  )
}

export default Button