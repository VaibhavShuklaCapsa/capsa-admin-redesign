"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { getReconciliationData, viewAccountStatement } from "../services/reconciliation"

const fmtNum = (val) => {
  if (val === null || val === undefined) return "—"
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

export default function ReconciliationPage() {
  const router                       = useRouter()
  const [loading, setLoading]        = useState(true)
  const [rec, setRec]                = useState(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownloadStatement = async () => {
    setDownloading(true)
    try {
      await viewAccountStatement({})
    } catch {
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    getReconciliationData()
      .then((res) => { setRec(res?.data ?? null) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Reconciliation</h2>
        <p className="text-sm text-grey">Showing balance summary</p>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <Button
            variant="outline"
            className="h-10 gap-2 border-borderGrey text-sm font-medium"
            onClick={() => router.push("/admin/reconciliation/balance-history")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            View Balance History
          </Button>

          <Button
            variant="outline"
            className="h-10 gap-2 border-borderGrey text-sm font-medium"
            disabled={downloading}
            onClick={handleDownloadStatement}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {downloading ? "Downloading..." : "Account Statement"}
          </Button>
        </div>

        {/* Balance table */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-5 text-left font-bold text-grey whitespace-nowrap">Pool Account Balance (₦)</th>
                <th className="px-6 py-5 text-left font-bold text-grey whitespace-nowrap">Capsa Platform Balance (₦)</th>
                <th className="px-6 py-5 text-left font-bold text-grey whitespace-nowrap">Difference (₦)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {rec ? (
                <tr>
                  <td className="px-6 py-5 text-tableGrey whitespace-nowrap">
                    {rec.error_pool
                      ? <span className="text-[#EF4444] text-xs">{rec.error_pool}</span>
                      : fmtNum(rec.pool_account_balance)
                    }
                  </td>
                  <td className="px-6 py-5 text-tableGrey whitespace-nowrap">
                    {rec.error_platform
                      ? <span className="text-[#EF4444] text-xs">{rec.error_platform}</span>
                      : fmtNum(rec.capsa_platform_balance)
                    }
                  </td>
                  <td className="px-6 py-5 text-tableGrey whitespace-nowrap">
                    {fmtNum(rec.difference)}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-16 text-grey text-sm">No reconciliation data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
