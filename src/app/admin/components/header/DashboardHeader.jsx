"use client";
import { useState } from "react";
import Image from "next/image";
import { getProfileFromToken, logOut } from "@/admin/app/services/auth";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { getInitials } from "@/admin/app/constants";

const DashboardHeader = () =>{
  const [open, setOpen] = useState(false);
  const {name} = getProfileFromToken()

  return (
    <div className="bg-gray-50">

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-r border-[#fff] bg-[#fff] shadow-sm relative">
        <div className="flex items-center gap-4">
          <Image src={"/images/capsa-colored.png"} className="flex md:hidden" width={155} height={35} alt='Capsa logo'/> 
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Image src={"/icons/help-circle.svg"} width={20} height={20} alt="Help" className="cursor-pointer"/>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Image src={"/icons/bell.svg"} width={20} height={20} alt="Notifications" className="cursor-pointer"/>
          </button>

          {/* Profile Dropdown */}
          <div className="hidden md:flex relative">
            <Popover>
                <PopoverTrigger asChild>
                   <button
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 border rounded-full px-3 py-1.5 hover:bg-gray-50 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-semibold ">
                        {getInitials(name)}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{name}</span>
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-semibold text-gray-800 cursor-pointer">My account</p>
                  </div>
                  <ul className="py-2 text-customBlack">
                    <li>
                      <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 font-medium cursor-pointer ">
                        <Image src={"/icons/guide.svg"} width={20} height={20} alt="Help" /> Guide
                      </a>
                    </li>
                    <li>
                      <a href="#" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 font-medium cursor-pointer">
                        <Image src={"/icons/help-circle.svg"} width={20} height={20} alt="Help" />FAQs
                      </a>
                    </li>
                    <li>
                      <button 
                        className="flex w-full items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                        onClick={() => logOut()}
                      >
                        <Image src={"/icons/logout.svg"} width={20} height={20} alt="Log out" /> Log out
                      </button>
                    </li>
                  </ul>
                </div>
                </PopoverContent>
                </Popover>

          </div>
        </div>
      </header>

    </div>
  );
}

export default DashboardHeader