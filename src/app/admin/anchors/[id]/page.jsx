"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { ChevronDown, ArrowDown, MoreHorizontal, Search, UserCircle2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import StatusBadge from "../../components/ui/StatusBadge"
import InfoField from "../../components/ui/InfoField"
import PageLoader from "../../components/ui/PageLoader"
import { getAnchorDetail, getAnchorSubAdmins } from "../../services/anchorDetail"
import EditAnchorGradeDialog from "../../components/EditAnchorGradeDialog"
import ChangeAnchorRateDialog from "../../components/ChangeAnchorRateDialog"
import ToggleRFDialog from "../../components/DisableRFDialog"
import EnableRFDialog from "../../components/EnableRFDialog"
import AddAdminDialog from "../../components/AddAdminDialog"
import EditAnchorEmailDialog from "../../components/EditAnchorEmailDialog"
import DeleteAdminDialog from "../../components/DeleteAdminDialog"
import EditAdminDialog from "../../components/EditAdminDialog"

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy") } catch { return val }
}

function AdminAvatar({ name }) {
  const initials = (name ?? "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join("")
  return (
    <div className="size-10 rounded-full bg-[#E4E4E7] flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-customBlack">{initials || "—"}</span>
    </div>
  )
}

function AdminCard({ admin, onEditClick, onDeleteClick }) {
  return (
    <div className="border border-borderGrey rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <AdminAvatar name={admin.name} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-deepGrey rounded">
              <MoreHorizontal className="size-4 text-grey" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem className="font-semibold text-customBlack p-3 cursor-default">Actions</DropdownMenuItem>
            <hr />
            <DropdownMenuItem className="p-3 text-sm cursor-pointer" onClick={() => onEditClick?.(admin)}>
              Edit Admin Details
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 text-sm cursor-pointer text-[#EF4444]" onClick={() => onDeleteClick?.(admin.id)}>
              Delete Admin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <p className="text-sm font-semibold text-customBlack">{admin.name || "—"}</p>
        <p className="text-sm text-grey">{admin.email || "—"}</p>
        <p className="text-sm font-semibold text-customBlack mt-1">{admin.role || "—"}</p>
      </div>
      <p className="text-xs text-grey">{fmtDate(admin.date_joined)}</p>
    </div>
  )
}

function SubAdminSettings({ panNumber, onAddAdmin }) {
  const [admins, setAdmins]               = useState([])
  const [total, setTotal]                 = useState(0)
  const [search, setSearch]               = useState("")
  const [loading, setLoading]             = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteAdminId, setDeleteAdminId]       = useState(null)
  const [editDialogOpen, setEditDialogOpen]     = useState(false)
  const [editAdmin, setEditAdmin]               = useState(null)

  const fetchAdmins = (searchVal = "") => {
    setLoading(true)
    getAnchorSubAdmins({ panNumber, search: searchVal })
      .then((res) => {
        setAdmins(res?.data?.sub_admins ?? [])
        setTotal(res?.data?.total ?? 0)
      })
      .catch(() => { setAdmins([]); setTotal(0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAdmins() }, [panNumber])

  const handleSearch = (val) => {
    setSearch(val)
    fetchAdmins(val)
  }

  const handleDeleteClick = (id) => {
    setDeleteAdminId(id)
    setDeleteDialogOpen(true)
  }

  const handleEditClick = (admin) => {
    setEditAdmin(admin)
    setEditDialogOpen(true)
  }

  return (
    <>
      <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
        <CardContent className="p-6">
          <div className="flex gap-8">
            {/* Left */}
            <div className="w-56 shrink-0 pt-2">
              <p className="text-base font-semibold text-customBlack">Sub-Admin Settings</p>
              <p className="text-sm text-grey mt-1">Manage your sub admins here</p>
            </div>

            {/* Right */}
            <div className="flex-1 space-y-4">
              {/* Toolbar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
                  <input
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search"
                    className="w-full pl-9 pr-3 h-10 border border-borderGrey rounded-lg text-sm bg-white outline-none placeholder:text-grey"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 h-10 border border-borderGrey rounded-lg text-sm text-customBlack bg-white shrink-0">
                  <UserCircle2 className="size-4 text-grey" />
                  <span>Total number of admins: <span className="font-semibold">{total}</span></span>
                </div>
                <button
                  className="h-10 px-4 rounded-lg text-sm font-medium text-white shrink-0"
                  style={{ background: "#0098DB" }}
                  onClick={onAddAdmin}
                >
                  Add Admin
                </button>
              </div>

              {/* Cards grid */}
              {loading ? (
                <p className="text-sm text-grey text-center py-12">Loading...</p>
              ) : admins.length === 0 ? (
                <p className="text-sm text-grey text-center py-12">No sub-admins found.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {admins.map((admin, i) => (
                    <AdminCard key={admin.sub_anchor_admin ?? i} admin={{
                      id: admin.sub_anchor_admin,
                      name: admin.name,
                      email: admin.email,
                      role: admin.role_label,
                      date_joined: admin.joined_at,
                      approve_reject_invoice: admin.approve_reject_invoice,
                      review_invoice:         admin.review_invoice,
                      upload_invoice:         admin.upload_invoice,
                      invite_vendor:          admin.invite_vendor,
                      add_admin:              admin.add_admin,
                    }} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteAdminDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        subAnchorAdmin={deleteAdminId}
        onSuccess={() => fetchAdmins(search)}
      />

      <EditAdminDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        admin={editAdmin}
        onSuccess={() => fetchAdmins(search)}
      />
    </>
  )
}

const getActions = (rfEnabled) => [
  { title: "Edit Email Address" },
  { title: "Edit Anchor Grade" },
  { title: rfEnabled ? "Disable Reverse Factoring" : "Enable Reverse Factoring" },
  ...(rfEnabled ? [{ title: "Change RF Rate" }] : []),
  { title: "divider" },
  { title: "Block Account" },
  { title: "Delete Account" },
]

export default function AnchorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeTab, setActiveTab]   = useState("anchor-information")

  const [anchor, setAnchor]         = useState(null)
  const [companyDocs, setCompanyDocs] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(false)
  const [gradeDialogOpen, setGradeDialogOpen]         = useState(false)
  const [rateDialogOpen, setRateDialogOpen]           = useState(false)
  const [disableRFDialogOpen, setDisableRFDialogOpen] = useState(false)
  const [enableRFDialogOpen, setEnableRFDialogOpen]   = useState(false)
  const [emailDialogOpen, setEmailDialogOpen]         = useState(false)
  const [addAdminOpen, setAddAdminOpen]               = useState(false)

  const fetchAnchor = () => {
    setLoading(true); setError(false)
    getAnchorDetail(params.id)
      .then((res) => {
        setAnchor(res?.data?.anchor ?? null)
        setCompanyDocs(res?.data?.company_docs ?? [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (activeTab === "anchor-information") fetchAnchor()
  }, [activeTab, params.id])

  if (activeTab === "anchor-information" && loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <Image
        src="/icons/left-arrow.svg"
        width={24}
        height={24}
        alt="Go back"
        className="cursor-pointer"
        onClick={() => router.back()}
      />

      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">User Details</h2>
        <p className="text-sm text-grey">Showing user information</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-full justify-start">
          <TabsTrigger value="anchor-information" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Anchor Information
          </TabsTrigger>
          <TabsTrigger value="sub-admin-settings" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Sub-Admin Settings
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Anchor Information ── */}
        <TabsContent value="anchor-information" className="space-y-6">
          {error || !anchor ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">
                Unable to load anchor information. Please try again.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
                <CardContent className="p-6 space-y-6">
                  <header className="flex items-start justify-between gap-4">
                    <section className="space-y-1">
                      <p className="text-sm text-grey">Anchor Name</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-customBlack">{anchor.name || "—"}</h3>
                        <StatusBadge status={anchor.status} />
                      </div>
                    </section>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 h-10 px-4">
                          Actions <ChevronDown className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                        <hr />
                        {getActions(anchor.rf_enabled).map((action) =>
                          action.title === "divider" ? (
                            <hr key="divider" />
                          ) : (
                            <DropdownMenuItem
                              key={action.title}
                              className={`p-4 text-sm cursor-pointer ${action.title === "Delete Account" ? "text-[#EF4444]" : action.title === "Block Account" ? "text-[#D97706]" : ""}`}
                              onClick={() => {
                                if (action.title === "Edit Email Address") setEmailDialogOpen(true)
                                else if (action.title === "Edit Anchor Grade") setGradeDialogOpen(true)
                                else if (action.title === "Change RF Rate") setRateDialogOpen(true)
                                else if (action.title === "Disable Reverse Factoring") setDisableRFDialogOpen(true)
                                else if (action.title === "Enable Reverse Factoring") setEnableRFDialogOpen(true)
                                else console.log(action.title, anchor)
                              }}
                            >
                              {action.title}
                            </DropdownMenuItem>
                          )
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </header>

                  {/* Row 1 */}
                  <section className="grid grid-cols-5 gap-6 pt-6">
                    <InfoField label="BVN" value={anchor.bvn || "—"} />
                    <InfoField label="Email Address" value={anchor.email || "—"} editable />
                    <InfoField label="RC Number" value={anchor.rc_number || "—"} />
                    <InfoField label="Anchor Grade" value={anchor.grade || "—"} />
                    <InfoField label="Date Joined" value={fmtDate(anchor.date_joined)} />
                  </section>

                  {/* Row 2 */}
                  <section className="grid grid-cols-5 gap-6 pt-6">
                    <InfoField label="Reverse Factoring" value={anchor.rf_enabled ? "Enabled" : "Disabled"} />
                    <InfoField label="Rate (%)" value={anchor.rate !== undefined && anchor.rate !== "" ? String(anchor.rate) : "—"} />
                    <InfoField label="Address" value={anchor.address || "—"} />
                    <InfoField label="Industry" value={anchor.industry || "—"} />
                    <InfoField label="Date Founded" value={fmtDate(anchor.date_founded)} />
                  </section>

                  {/* Row 3 */}
                  <section className="grid grid-cols-5 gap-6 pt-6">
                    <InfoField label="Key Person" value={anchor.key_person || "—"} />
                    <InfoField label="Key Person Mobile Number" value={anchor.key_person_mobile || "—"} />
                  </section>
                </CardContent>
              </Card>

              {/* Company Documents */}
              {companyDocs.length > 0 && (
                <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="text-base font-semibold text-customBlack">Company Information Documents</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {companyDocs.map((doc) => (
                        <div key={doc.label} className="flex items-center gap-3 bg-[#F4F4F5] rounded-xl p-4">
                          <Image src="/icons/document-2.svg" width={24} height={24} alt="file" className="shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-customBlack">{doc.label}:</p>
                            <p className="text-sm text-grey break-all">{doc.filename || "No file"}</p>
                          </div>
                          {doc.url && (
                            <button
                              onClick={() => window.open(doc.url, "_blank")}
                              className="shrink-0 size-8 rounded-full border border-[#09090B] flex items-center justify-center hover:opacity-70 transition-opacity"
                            >
                              <ArrowDown className="size-4 text-customBlack" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Tab 2: Beneficiary Account — pending API ── */}
        {/* ── Tab 2: Sub-Admin Settings ── */}
        <TabsContent value="sub-admin-settings">
          <SubAdminSettings panNumber={params.id} onAddAdmin={() => setAddAdminOpen(true)} />
        </TabsContent>
      </Tabs>

      <EditAnchorGradeDialog
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
        panNumber={params.id}
        currentGrade={anchor?.grade}
        onSuccess={fetchAnchor}
      />

      <ChangeAnchorRateDialog
        open={rateDialogOpen}
        onOpenChange={setRateDialogOpen}
        panNumber={params.id}
        currentRate={anchor?.rate}
        onSuccess={fetchAnchor}
      />

      <ToggleRFDialog
        open={disableRFDialogOpen}
        onOpenChange={setDisableRFDialogOpen}
        panNumber={params.id}
        rfEnabled={true}
        onSuccess={fetchAnchor}
      />

      <EnableRFDialog
        open={enableRFDialogOpen}
        onOpenChange={setEnableRFDialogOpen}
        panNumber={params.id}
        currentRate={anchor?.rate}
        onSuccess={fetchAnchor}
      />

      <AddAdminDialog
        open={addAdminOpen}
        onOpenChange={setAddAdminOpen}
        panNumber={params.id}
        onSuccess={() => setActiveTab("sub-admin-settings")}
      />

      <EditAnchorEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        panNumber={params.id}
        currentEmail={anchor?.email}
        onSuccess={fetchAnchor}
      />
    </section>
  )
}
