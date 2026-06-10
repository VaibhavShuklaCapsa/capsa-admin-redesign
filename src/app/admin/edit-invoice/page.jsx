"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, MoreHorizontal, Search } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getEditInvoiceList, deleteInvoice } from "../services/editInvoice"

const ROWS = [
  { id:"1", invoiceNo:"IN0000001",  vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"30", dueDate:"Sept 30, 2021" },
  { id:"2", invoiceNo:"IN0000232",  vendorName:"Shell PLC",             anchorName:"Shell PLC",             amount:"200,000,000", tenor:"30", dueDate:"Sept 30, 2021" },
  { id:"3", invoiceNo:"INVG672627", vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"30", dueDate:"Sept 21, 2021" },
  { id:"4", invoiceNo:"INVB47827",  vendorName:"Delloite Nigeria",       anchorName:"Delloite Nigeria",       amount:"200,000,000", tenor:"30", dueDate:"Mar 21, 2021"  },
  { id:"5", invoiceNo:"IN0000001",  vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"30", dueDate:"Aug 21, 2021"  },
  { id:"6", invoiceNo:"IN0000001",  vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"45", dueDate:"Aug 21, 2021"  },
  { id:"7", invoiceNo:"IN0000001",  vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"45", dueDate:"Aug 21, 2021"  },
  { id:"8", invoiceNo:"IN0000001",  vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"60", dueDate:"Aug 21, 2021"  },
  { id:"9", invoiceNo:"IN0000001",  vendorName:"Stanbic IBTC Bank Plc", anchorName:"Stanbic IBTC Bank Plc", amount:"200,000,000", tenor:"60", dueDate:"Aug 21, 2021"  },
]

const PAGE_DATA = {
  dateRangeLabel: "Jan 20, 2023 - Feb 09, 2023",
  rows:           ROWS,
  totalPages:     10,
}

export default function EditInvoicePage() {
  const router                        = useRouter()
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getEditInvoiceList(PAGE_DATA).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    if (!q) return data.rows
    return data.rows.filter((r) =>
      r.invoiceNo.toLowerCase().includes(q) || r.vendorName.toLowerCase().includes(q)
    )
  }, [data, search])

  const handleDelete = async (row) => {
    await deleteInvoice({ id: row.id })
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Edit Invoice</h2>
        <p className="text-sm text-grey">Showing live invoices that can be edited</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label={data.dateRangeLabel} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        {/* Search + filter toolbar */}
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="Search by invoice number, vendor"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
          <Button variant="outline" className="h-10 gap-2 border-borderGrey">
            <Filter className="size-4 text-grey" />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Invoice No</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Vendor Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Anchor Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Amount (₦)</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Tenor (Days)</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Due Date</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.invoiceNo}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.vendorName}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchorName}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.amount}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.tenor}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.dueDate}</TableCell>
                  <TableCell className="px-6 py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                        <hr />
                        <DropdownMenuItem
                          className="p-4 text-sm cursor-pointer"
                          onClick={() => router.push(`/admin/edit-invoice/${row.id}?data=${encodeURIComponent(JSON.stringify(row))}`)}
                        >
                          Edit Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="p-4 text-sm cursor-pointer text-[#EF4444]"
                          onClick={() => handleDelete(row)}
                        >
                          Delete Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={setCurrentPage} />
        </footer>
      </section>
    </section>
  )
}
