import React, { useState } from 'react'
import Pagination from '../Pagination/Pagination'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MobileCard from '../card/MobileCard'
import { format } from 'date-fns'

// Helper function to safely parse and format dates
const safeFormatDate = (dateValue, dateFormat = "LLL dd, y") => {
  if (!dateValue) return '-';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '-';
    return format(date, dateFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

const sampleData = [
  { id: 'INO000001', issueDate: 'Sept 30, 2021', dueDate: 'Oct 31, 2021', anchor: 'Stanbic IBTC Bank Plc', amount: '550,000', status: 'Live' },
  { id: 'IN0000232', issueDate: 'Sept 21, 2021', dueDate: 'Oct 21, 2021', anchor: 'Shell PLC', amount: '100,000,000,000', status: 'Pending' },
  { id: 'INVG672627', issueDate: 'Mar 21, 2021', dueDate: 'Dec 21, 2021', anchor: 'Delloite Nigeria', amount: '30,000,000', status: 'Not Presented' },
  { id: 'INVB47827', issueDate: 'Aug 21, 2021', dueDate: 'Sep 21, 2021', anchor: 'Stanbic IBTC Bank Plc', amount: '100,000,000,000', status: 'Sold' },
]

const StatusBadge = ({ status }) => {
  const map = {
    Live: 'bg-green-100 text-green-800',
    Pending: 'bg-orange-100 text-orange-800',
    'Not Presented': 'bg-gray-100 text-gray-700',
    Sold: 'bg-sky-100 text-sky-800',
  }
  const classes = map[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  )
}

export default function RecentInvoices({ data = sampleData }) {
  const [page, setPage] = useState(1)

  const router = useRouter()

  const handleRoute = (row) => {
    router.push(`/invoices/${row?.id}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <h4 className="text-base md:text-base font-bold">Recent Invoices</h4>
        <Link
            href={"/invoices"}
            className="text-blue font-bold underline"
        >
            View All
        </Link>
        {/* <a href="#" className="text-blue font-bold underline" onClick={() => router.push("/invoices")}>View All</a> */}
      </div>

      <div className="hidden md:block overflow-x-auto bg-white border border-gray-200 rounded-md shadow-md">
        <table className="min-w-full divide-y divide-customWhite">
          <thead className="bg-white">
            <tr>
              <th className="px-4 py-6 text-left text-grey font-bold">Invoice No</th>
              <th className="px-4 py-6 text-left text-grey font-bold ">Issue Date</th>
              <th className="px-4 py-6 text-left text-grey font-bold">Due Date</th>
              <th className="px-4 py-6 text-left text-grey font-bold">Anchor</th>
              <th className="px-4 py-6 text-left text-grey font-bold">Amount (₦)</th>
              <th className="px-4 py-6 text-left text-grey font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y-2 divide-customWhite">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td 
                  className="px-4 py-6 whitespace-nowrap text-tableGrey font-medium hover:underline"
                  onClick={() => handleRoute(row)}
                >
                  {row?.invoice_number
                }</td>
                <td className="px-4 py-6 whitespace-nowrap text-tableGrey font-medium">{row?.issueDate ? row?.issueDate : safeFormatDate(row?.invoice_date, "LLL dd, y")}</td>
                <td className="px-4 py-6 whitespace-nowrap text-tableGrey font-medium">{row?.dueDate? row?.dueDate : safeFormatDate(row?.invoice_due_date, "LLL dd, y")}</td>
                <td className="px-4 py-6 whitespace-nowrap text-tableGrey font-medium">{row?.anchor_name}</td>
                <td className="px-4 py-6 whitespace-nowrap text-tableGrey font-medium">{(row?.invoice_value)?.toLocaleString()}</td>
                <td className="px-4 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='block md:hidden'>
        {
          data?.map((data, idx) => (
            <div key={data?.id} className={`${idx === 0 ? "my-0" : "my-4"}`}>
              <MobileCard invoice={data} handleClick={handleRoute}/>
            </div>
          ))
        }
      </div>
    </div>
  )
}
