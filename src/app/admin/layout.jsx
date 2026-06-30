"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

const TAB_ICON = (name) => `/icons/admin/tabs/Capsa Redesign_icon/${name}`

const sidebarItems = [
  { label: "Dashboard",                      href: "/admin/dashboard",                  icon: TAB_ICON("home-01.svg")                  },
  { label: "Vendors",                        href: "/admin/vendors",                    icon: TAB_ICON("user-group.svg")            },
  { label: "Investors",                      href: "/admin/investors",                  icon: TAB_ICON("user-multiple.svg")               },
  { label: "Anchors",                        href: "/admin/anchors",                    icon: TAB_ICON("user-list.svg")           },
  { label: "Growth Partners",               href: "/admin/growth-partners",            icon: TAB_ICON("user-status.svg")                },
  { label: "Guarantors",                     href: "/admin/guarantors",                 icon: TAB_ICON("user-shield-01.svg")              },
  { label: "Transaction Volume",             href: "/admin/transaction-volume",         icon: TAB_ICON("analytics-up.svg")             },
  { label: "Invoices",                       href: "/admin/invoices",                   icon: TAB_ICON("invoice-04.svg")               },
  { label: "Anchor Invoices (RF)",           href: "/admin/anchor-invoices",            icon: TAB_ICON("note.svg")               },
  { label: "Recurring Revenue",              href: "/admin/recurring-revenue",          icon: TAB_ICON("invoice-01.svg")               },
  { label: "Assets",                         href: "/admin/assets",                     icon: TAB_ICON("invoice-02.svg")                     },
  { label: "VAT List",                       href: "/admin/vat-list",                   icon: TAB_ICON("check-list.svg")             },
  { label: "Account",                        href: "/admin/account",                    icon: TAB_ICON("credit-card.svg")              },
  { label: "Manual Settlement",              href: "/admin/manual-settlement",          icon: TAB_ICON("checkmark-square-01.svg")             },
  { label: "Transaction Ledger (Accounts)",  href: "/admin/transaction-ledger-accounts",icon: TAB_ICON("task-daily-02.svg")            },
  { label: "Transaction Ledger (Wallets)",   href: "/admin/transaction-ledger-wallets", icon: TAB_ICON("task-done-02.svg")               },
  { label: "Reconciliation",                 href: "/admin/reconciliation",             icon: TAB_ICON("document-validation.svg")        },
  { label: "Push Notifications",             href: "/admin/push-notifications",         icon: TAB_ICON("message-notification-02.svg")  },
  { label: "Transfer Funds",                 href: "/admin/transfer-funds",             icon: TAB_ICON("money-exchange-02.svg")    },
  { label: "Revenue",                        href: "/admin/revenue",                    icon: TAB_ICON("money-receive-flow-01.svg")         },
  { label: "Revenue Amount",                 href: "/admin/revenue-amount",             icon: TAB_ICON("money-receive-01.svg")         },
  { label: "Revenue Amount (Sterling)",      href: "/admin/revenue-amount-sterling",    icon: TAB_ICON("money-receive-02.svg")         },
  { label: "Blocked Amount",                 href: "/admin/blocked-amount",             icon: TAB_ICON("money-not-found-02.svg")       },
  { label: "Pending Accounts",               href: "/admin/pending-accounts",           icon: TAB_ICON("user-id-verification.svg")     },
  { label: "Edit Invoice",                   href: "/admin/edit-invoice",               icon: TAB_ICON("file-edit.svg")                },
  { label: "Vendor Sweep-In List",           href: "/admin/vendor-sweep-in-list",       icon: TAB_ICON("list-setting.svg")      },
  { label: "Deleted Accounts",               href: "/admin/deleted-accounts",           icon: TAB_ICON("user-remove-02.svg")           },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-[#f8f8f8]">

      {/* Sidebar */}
      <aside className="hidden md:flex w-[296px] bg-white border-r border-[#e8e8e8] flex-col h-screen p-2">

        {/* Logo */}
        {/* <div className="mb-8 px-2">
          <Image
            src="/images/capsa-colored.png"
            width={150}
            height={40}
            alt="Capsa Logo"
          />
        </div> */}
        <div className="mb-6 pl-2 pt-1">
        <Image
            src="/images/capsa-colored.png"
            width={120}
            height={30}
            alt="Capsa Logo"
            className="object-contain"
        />
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2 no-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
            //   <Link
            //     key={item.href}
            //     href={item.href}
            //     className={`flex items-center px-4 py-3 rounded-2xl text-[15px] transition-all ${
            //       isActive
            //         ? "bg-[#EAF6FB] text-[#0F172A] font-semibold"
            //         : "text-gray-800 hover:bg-gray-100"
            //     }`}
            //   >
            //     {item.label}
            //   </Link>
            <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
              isActive
                ? "bg-[#EAF6FB] text-[#004C6E] font-bold text-[16px] leading-[140%]"
                : "text-[#09090B] text-[16px] font-medium leading-[140%] hover:bg-gray-100"
            }`}
          >
            <Image
              src={item.icon}
              width={18}
              height={18}
              alt={item.label}
              className={`shrink-0 transition-all ${isActive ? "brightness-0 saturate-100 [filter:brightness(0)_saturate(100%)_invert(18%)_sepia(96%)_saturate(764%)_hue-rotate(175deg)_brightness(94%)]" : ""}`}
            />
          
            <span>
              {item.label}
            </span>
          </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col h-screen">

        {/* Topbar */}
        <header className="h-[72px] bg-white border-b border-[#e8e8e8] px-6 flex items-center justify-end gap-4">
          {/* Help */}
          <button className="w-9 h-9 rounded-full border border-[#e8e8e8] flex items-center justify-center text-grey hover:bg-gray-50">
            <span className="text-base font-semibold leading-none">?</span>
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 rounded-full border border-[#e8e8e8] flex items-center justify-center text-grey hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>

          {/* User */}
          <button className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-2 py-1">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image src="/images/avatar.png" width={32} height={32} alt="Admin" className="object-cover w-full h-full" onError={(e) => { e.target.style.display = "none" }} />
            </div>
            <span className="text-sm font-semibold text-customBlack">Admin Name</span>
            <ChevronDown className="size-4 text-grey" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
