"use client"
import React from 'react'
import {ArrowLeft, ArrowRight} from 'lucide-react'
import { useMediaQuery } from '@/app/hooks/useMediaQuery';

// Helper to create page range with ellipses
function getPageRange(current, total, siblingCount = 1, isMobile = false) {
   if (isMobile) {
    // MOBILE BEHAVIOR:
    // return: [currentPage, "...", totalPage]
    if (total <= 1) return [1];

    const pages = [];

    // Always show current page
    pages.push(current);

    // Show ellipsis only if gap is large
    if (current < total - 1) {
      pages.push("...");
    }

    // Always show last page (if different)
    if (current !== total) {
      pages.push(total);
    }

    return pages;
  }
  const totalPageNumbers = isMobile ? siblingCount : siblingCount * 2 + 5;

  // Case 1: Show all pages if few enough
  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 1);
  const rightSiblingIndex = Math.min(current + siblingCount, total);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < total - 1;

  const pages = [];

  // Always include first page
  pages.push(1);

  // Add left ellipsis if needed
  if (shouldShowLeftEllipsis) {
    pages.push("LEFT_ELLIPSIS");
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) {
      pages.push(i);
    }
  }

  // Add middle pages
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== total) pages.push(i); // avoid duplicate 1 or total
  }

  // Add right ellipsis if needed
  if (shouldShowRightEllipsis) {
    pages.push("RIGHT_ELLIPSIS");
  } else {
    for (let i = rightSiblingIndex + 1; i < total; i++) {
      pages.push(i);
    }
  }

  // Always include last page
  if (total > 1) pages.push(total);

  return pages;
}


export default function Pagination({ currentPage = 1, totalPages = 10, onPageChange = () => {} }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const pages = getPageRange(currentPage, totalPages, 1, isMobile)

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <nav className="flex items-center justify-between p-0 md:p-3 mb-2 md:mb-0">
      <div className="flex-1 flex items-center justify-start">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md border bg-white text-xs md:text-sm inline-flex items-center gap-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow'} `}
          aria-label="Previous page"
        >
          <ArrowLeft className='w-4 h-4'/>
          <span>Previous</span>
        </button>
      </div>

       {/* <li className="flex md:hidden items-center gap-2 text-sm ml-2"> */}

    {/* Current Page */}
          {/* <button
            aria-current="page"
            className="w-9 h-9 flex items-center justify-center rounded-full border bg-white text-gray-800 shadow text-xs"
          >
            {totalPages > currentPage ? currentPage : totalPages - 1}
          </button> */}

          {/* Ellipsis */}
          {/* {totalPages > 2 && (
            <span className="px-2 text-gray-500 text-xs">…</span>
          )} */}

          {/* Last Page */}
          {/* {totalPages > 1 && (
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-9 h-9 flex items-center justify-center rounded-full border text-gray-600 hover:bg-white hover:shadow text-xs"
            >
              {totalPages}
            </button>
          )} */}
        {/* </li> */}

      <ul className="flex items-center gap-2 ml-2">
        {pages.map((p, idx) => (
          <li key={idx} className='text-xs md:text-bsse'>
            {p === 'LEFT_ELLIPSIS' || p === 'RIGHT_ELLIPSIS' ? (
              <span className="px-3 py-2 text-sm text-gray-500">…</span>
            ) : (
              <button
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                className={`w-7 md:w-9 h-7 md:h-9 flex items-center justify-center text-xs md:text-sm cursor-pointer ${p === currentPage ? 'bg-white text-gray-800 shadow border rounded-full' : 'bg-none text-gray-600 hover:bg-white hover:shadow hover:rounded-full'}`}
              >
                {p}
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="flex-1 flex items-center justify-end">
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-md border bg-white text-xs md:text-sm inline-flex items-center gap-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:shadow'}`}
          aria-label="Next page"
        >
          <span>Next</span>
           <ArrowRight className='w-4 h-4'/>
        </button>
      </div>
    </nav>
  )
}
