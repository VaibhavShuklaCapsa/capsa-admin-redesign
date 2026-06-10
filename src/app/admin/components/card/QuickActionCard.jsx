"use client";

import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const QuickActionCard = ({icon, text, route = "", handleClick}) => {
  const router = useRouter()
  return (
    <div 
      className='bg-[#fff] flex flex-1 justify-between border border-solid border-[#E9EAEB] p-4 md:p-7 rounded-lg cursor-pointer hover:bg-gray-100'
       onClick={() => {
        handleClick && handleClick()
        route && router.push(route)
      }}
    >
        <div className='flex items-center'>
            <button className="flex flex-col md:flex-row items-start md:items-center gap-2 text-blue rounded-lg font-bold text-xs md:text-base text-left">
                <Image src={icon} width={20} height={20} alt="icon" />
                {text}
            </button>

        </div>
        <Image 
          src={"/icons/arrow.svg"}
          width={6} 
          height={6} 
          alt='icon' 
        />
    </div>
  )
}

export default QuickActionCard