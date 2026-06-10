"use client"

import { useEffect, useMemo, useState } from "react"
import { MoreHorizontal, Search, ChevronDown } from "lucide-react"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
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
import {
  getPushNotificationsData,
  sendPushNotification,
  sendBatchPushNotification,
} from "../services/pushNotifications"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"

const TABLE_HEADER = [
  { key: "Account Name",   title: "accountName"  },
  { key: "Email Address",  title: "email"        },
  { key: "Account Type",   title: "accountType"  },
]

const ROWS = [
  { id:"1", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Investor" },
  { id:"2", accountName:"Shell PLC",             email:"silver@shell.com",   accountType:"Vendor"   },
  { id:"3", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Vendor"   },
  { id:"4", accountName:"Delloite Nigeria",       email:"admin@delloite.com", accountType:"Vendor"   },
  { id:"5", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Vendor"   },
  { id:"6", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Investor" },
  { id:"7", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Investor" },
  { id:"8", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Investor" },
  { id:"9", accountName:"Stanbic IBTC Bank Plc", email:"force@stanbic.com",  accountType:"Vendor"   },
]

const USER_FILTER_OPTIONS = ["All Users", "Vendors", "Investors"]

const PAGE_DATA = {
  pageTitle:   "Push Notifications",
  pageSubtitle:"Send push notifications to users",
  tableHeader: TABLE_HEADER,
  rows:        ROWS,
  totalPages:  10,
}

export default function PushNotificationsPage() {
  const [data, setData]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState("")
  const [userFilter, setUserFilter] = useState("All Users")
  const [currentPage, setCurrentPage] = useState(1)

  // Modal state
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalTarget, setModalTarget] = useState(null) // null = batch, row = single
  const [notifTitle, setNotifTitle] = useState("")
  const [notifContent, setNotifContent] = useState("")
  const [sending, setSending]       = useState(false)

  useEffect(() => {
    setLoading(true)
    getPushNotificationsData(PAGE_DATA).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    return data.rows.filter((r) => {
      const matchFilter = userFilter === "All Users" ||
        (userFilter === "Vendors" && r.accountType === "Vendor") ||
        (userFilter === "Investors" && r.accountType === "Investor")
      const matchSearch = !q || r.email.toLowerCase().includes(q) || r.accountName.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [data, search, userFilter])

  const openModal = (row = null) => {
    setModalTarget(row)
    setNotifTitle("")
    setNotifContent("")
    setModalOpen(true)
  }

  const handleSend = async () => {
    setSending(true)
    const payload = { title: notifTitle, content: notifContent, target: modalTarget }
    try {
      const res = modalTarget
        ? await sendPushNotification(payload)
        : await sendBatchPushNotification(payload)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSending(false)
      setModalOpen(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-customBlack mb-1">{data.pageTitle}</h2>
          <p className="text-sm text-grey">{data.pageSubtitle}</p>
        </div>
        <Button
          className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10 shrink-0"
          onClick={() => openModal(null)}
        >
          Send Batch Notification
        </Button>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">

        {/* Search + user filter toolbar */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-borderGrey">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="Search by email"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[180px] justify-between">
                Showing {userFilter}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              {USER_FILTER_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  className="cursor-pointer"
                  onClick={() => { setUserFilter(opt); setCurrentPage(1) }}
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                {data.tableHeader.map((col) => (
                  <TableHead key={col.key} className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">
                    {col.key}
                  </TableHead>
                ))}
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  {data.tableHeader.map((col) => (
                    <TableCell key={col.key} className="px-6 py-6 text-tableGrey whitespace-nowrap">
                      {row[col.title]}
                    </TableCell>
                  ))}
                  <TableCell className="px-6 py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">
                          Actions
                        </DropdownMenuItem>
                        <hr />
                        <DropdownMenuItem
                          className="p-4 text-sm cursor-pointer"
                          onClick={() => openModal(row)}
                        >
                          Send Notification
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
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </footer>
      </section>

      {/* Send Notification Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-customBlack">
              Send Notification to Users
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-customBlack">Title</label>
              <Input
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="Enter Notification Title"
                className="h-11 border-borderGrey"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-customBlack">Notification Content</label>
              <Textarea
                value={notifContent}
                onChange={(e) => setNotifContent(e.target.value)}
                placeholder="Enter Notification Content"
                className="min-h-[120px] border-borderGrey resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              className="h-11 px-6 border-borderGrey"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue hover:bg-blue/90 text-white h-11 px-6"
              disabled={!notifTitle || !notifContent || sending}
              onClick={handleSend}
            >
              {sending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
