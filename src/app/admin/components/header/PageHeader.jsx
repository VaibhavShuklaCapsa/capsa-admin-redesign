"use client"
import React from 'react'
import {ArrowLeft, Filter, MoreVertical} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

const PageHeader = ({currentTitle, goBack = false, dropdown = [], filter = false, handleBack}) => {
    const router = useRouter()
  return (
    <div>
        {goBack ?
            <Image 
              src={"/icons/left-arrow.svg"}
              className='cursor-pointer mb-2 md:mb-4'
              width={24} 
              height={24} 
              alt='go back' 
              onClick={() => {handleBack ? handleBack() :
                router.back()
              }}
            /> :
            null
        }
        <div className="flex justify-between items-center mb-6">
          <div className='w-full'>
            <h2 className='text-lg md:text-2xl'>{currentTitle?.pageTitle}</h2>
            <p className='text-xs md:text-base text-grey md:text-customBlack mt-2 w-full'>{currentTitle?.pageSubtitle}</p>
          </div>

          <div className='flex md:hidden gap-4 h'>
             {filter && <Button variant="outline" className="flex items-center gap-2 h-10 px-4">
                  <Filter className="h-4 w-4" />
              </Button>}

              {dropdown.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={"flex items-center gap-2 h-10 px-4"}>
                      <MoreVertical className="h-4 w-4" />
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={"min-w-56"}>
                  <DropdownMenuItem className={"text-customBlack font-semibold p-4 cursor-pointer"}>Actions</DropdownMenuItem>
                  <hr />
                      {
                        dropdown?.map((action, idx) => (
                        action?.title && <DropdownMenuItem key={idx} className={`p-4 text-sm cursor-pointer ${action?.title.includes("Delete") || action?.title.includes("Cancel")  ? "text-[#EF4444]" : ""}`} onClick={() => action?.handleClick && action?.handleClick()}>{action?.title}</DropdownMenuItem>
                      ))
                      }
                    </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>
        </div>
    </div>
  )
}

export default PageHeader