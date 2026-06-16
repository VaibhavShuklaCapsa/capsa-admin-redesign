"use client"

import { useEffect, useState } from "react"
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

const PAGE_SIZE = 10
const USER_FILTER_OPTIONS = ["All Users", "Vendors", "Investors"]

export default function PushNotificationsPage() {
  const [loading, setLoading]         = useState(true)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [userFilter, setUserFilter]   = useState("All Users")

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false)
  const [modalTarget, setModalTarget]   = useState(null)
  const [notifTitle, setNotifTitle]     = useState("")
  const [notifContent, setNotifContent] = useState("")
  const [sending, setSending]           = useState(false)

  const fetchData = async ({ page = 1, searchVal = "" }) => {
    const res = await getPushNotificationsData({ page_number: page, page_size: PAGE_SIZE, search: searchVal })
    setRows(res?.data?.user_list ?? [])
    setTotalPages(res?.data?.pagination?.total_pages ?? 1)
  }

  useEffect(() => {
    fetchData({ page: 1 })
      .catch(() => {})
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val }).catch(() => {})
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, searchVal: search }).catch(() => {})
  }

  const handleFilterChange = (opt) => {
    setUserFilter(opt)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search }).catch(() => {})
  }

  const filteredRows = rows.filter((r) => {
    if (userFilter === "Vendors")   return r.account_type === "Vendor"
    if (userFilter === "Investors") return r.account_type === "Investor"
    return true
  })

  const openModal = (row = null) => {
    setModalTarget(row)
    setNotifTitle("")
    setNotifContent("")
    setModalOpen(true)
  }

  const handleSend = async () => {
    setSending(true)
    try {
      if (modalTarget) {
        // Single notification
        const res = await sendPushNotification({ email: modalTarget.email, title: notifTitle, body: notifContent })
        if (res?.res === "success") {
          toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
          fetchData({ page: currentPage, searchVal: search }).catch(() => {})
        } else {
          toast(<ErrorToast message={res?.messg || "Failed to send notification"} />, { style: { padding: 0 } })
        }
      } else {
        // Batch notification
        const res = await sendBatchPushNotification({ title: notifTitle, body: notifContent })
        if (res?.res === "success") {
          toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
          fetchData({ page: currentPage, searchVal: search }).catch(() => {})
        } else {
          toast(<ErrorToast message={res?.messg || "Failed to send notification"} />, { style: { padding: 0 } })
        }
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSending(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Push Notifications</h2>
          <p className="text-sm text-grey">Send push notifications to users</p>
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
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by email or name"
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
                  onClick={() => handleFilterChange(opt)}
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
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Email Address</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Type</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-grey text-sm">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row, i) => (
                  <TableRow key={row.email ?? i}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">
                      {row.account_name || "—"}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.account_type}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
