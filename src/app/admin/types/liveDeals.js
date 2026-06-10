// Invoice Deal Types
/**
 * @typedef {Object} InvoiceDeal
 * @property {string} deal_id
 * @property {string} invoice_number
 * @property {number} invoice_value
 * @property {string} anchor_name
 * @property {number} tenor
 * @property {number} discount_percentage
 * @property {string} currency
 * @property {string} seller_name
 * @property {string} status
 * @property {string} [buttonStatus]
 * @property {boolean} [showBuyNowButton]
 * @property {number} [buy_now_price]
 * @property {string} [RF]
 * @property {string} [resell_status]
 * @property {string} [is_refusal]
 * @property {string} [SM] - Secondary market flag
 */

/**
 * @typedef {Object} RevenueDeal
 * @property {string} deal_id
 * @property {string} revenue_no
 * @property {string} revenue_name
 * @property {number} revenue_value
 * @property {number} discount_value
 * @property {string} trxn_date
 * @property {string} status
 * @property {string} seller_name
 * @property {string} interval
 * @property {number} tenor
 * @property {number} discount_rate
 * @property {number} units_sold
 * @property {number} total_units
 */

/**
 * @typedef {Object} Guarantor
 * @property {string} NAME
 * @property {string} RC_number
 */

/**
 * @typedef {Object} Seller
 * @property {string} PAN
 * @property {string} company_name
 * @property {string} CIN
 * @property {string} industry
 */

/**
 * @typedef {Object} AssetDeal
 * @property {string} asset_id
 * @property {string} asset_name
 * @property {string} asset_number
 * @property {number} asset_value
 * @property {number} units_sold
 * @property {number} units_available
 * @property {number} total_units
 * @property {number} unit_value
 * @property {string} issue_date
 * @property {string} maturity_date
 * @property {number} discount_rate
 * @property {string} ratings
 * @property {number} tenure
 * @property {Guarantor} guaranter
 * @property {Seller} seller
 */

/**
 * @typedef {Object} InvestorFinalDealsResponse
 * @property {string} res
 * @property {string} [messg]
 * @property {Object} [data]
 * @property {any[]} [data.anchorsList]
 * @property {(InvoiceDeal | RevenueDeal | AssetDeal)[]} [data.dealsList]
 */

/**
 * @typedef {Object} RecurringRevenueDealsResponse
 * @property {string} res
 * @property {string} [messg]
 * @property {RevenueDeal[]} [data]
 */

/**
 * @typedef {Object} TradeAssetDealsResponse
 * @property {string} res
 * @property {string} [messg]
 * @property {AssetDeal[]} [data]
 */

/**
 * @typedef {Object} InvoiceDealsPayload
 * @property {string} panNumber
 * @property {string} role
 * @property {string} showRevenue
 * @property {string|null} currency
 * @property {"0"|"1"} SM
 * @property {Object} [filters]
 * @property {string} [filters.anchor]
 * @property {Object} [filters.invoice_value]
 * @property {string} [filters.invoice_value.min]
 * @property {string} [filters.invoice_value.max]
 * @property {string} [filters.tenor]
 * @property {string} [search]
 */

/**
 * @typedef {Object} RevenueDealsPayload
 * @property {string} panNumber
 * @property {string} role
 */

/**
 * @typedef {Object} AssetDealsPayload
 * @property {string} panNumber
 * @property {string} role
 */

/**
 * @typedef {"Invoices" | "Buy-Only Invoices" | "Revenues" | "Assets"} LiveDealsTab
 */

/**
 * @typedef {"all" | "NGN" | "USD"} CurrencyFilter
 */

/**
 * @typedef {Object} LiveDealsState
 * @property {LiveDealsTab} activeTab
 * @property {InvoiceDeal[]} invoiceDeals
 * @property {RevenueDeal[]} revenueDeals
 * @property {AssetDeal[]} assetDeals
 * @property {boolean} isLoading
 * @property {string|null} error
 * @property {CurrencyFilter} currency
 * @property {number} currentPage
 * @property {number} itemsPerPage
 */
