import Image from 'next/image'
import React from 'react'

const DetailCard = ({ title, value, handleClick }) => {
  return (
    <div className="flex items-center justify-between gap-3 bg-[#F4F4F5] px-4 py-4 rounded-lg w-full">
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src="/icons/document-2.svg"
          width={24}
          height={24}
          alt="document icon"
          className="shrink-0"
        />
        <div className="min-w-0">
          {title && (
            <p className="text-sm font-semibold text-customBlack truncate">
              {title}:
            </p>
          )}
          {value && (
            <p className="text-sm text-grey break-all leading-snug">{value}</p>
          )}
        </div>
      </div>

      <Image
        src="/icons/download-circle-01.svg"
        width={28}
        height={28}
        alt="download"
        className="cursor-pointer shrink-0"
        onClick={() => handleClick?.()}
      />
    </div>
  )
}

export default DetailCard
