export const routes = {
    Login: () => {
        return `/redesign/signin/submit`
    },
    VendorDashboard: () => {
        return `/redesign/requestor/vendor_dashboard`
    },
    vendorDashboardRR: () => {
        return `/redesign/requestor/vendor_dashboard_rr`
    },
    InvoiceList: () => {
        return `/redesign/requestor/invoicelist`
    },
    invoiceLiveDealsDetails: () => {
        return `/redesign/investor/invoiceLiveDealsDetails`
    },
    GetBids: () => {
        return `/redesign/requestor/getbidProposal`
    },
    RevenueBidsList: () => {
        return `/redesign/requestor/revenuebidslist`
    },
    GetBidDetail: () => {
        return `/redesign/requestor/getProposalDetails`
    },
    RevenueDetails: () => {
        return `/redesign/requestor/revenueBiddetails`
    },
    GetInvoiceDetails: () => {
        return `/redesign/requestor/invoiceByNumber`
    },
    GetInvoiceDetailsRequestor: () => {
        return `/redesign/requestor/getInvoiceDetails`
    },
    GetAnchorInvoiceDetails: () => {
        return `/redesign/anchor/getInvoiceDetails`
    },
    GetFile: () => {
        return `/redesign/requestor/getFile`
    },
    GetAnchorInvoiceFile: () => {
        return `/redesign/anchor/getInvFile`
    },
    ApproveInvoice: () => {
        return `/redesign/requestor/requestApproval`
    },
    RequestApproval: () => {
        return `/redesign/requestor/requestApproval`
    },
    DeleteInvoice: () => {
        return `/redesign/requestor/deleteInvoice`
    },
    DeleteRevenue: () => {
        return `/redesign/requestor/deleteRevenue`
    },
    EditRevenue: () => {
        return `/redesign/requestor/editRevenue`
    },
    DeleteInvoiceAnchor: () => {
        return `/redesign/anchor/invoiceDeleteAnchor`
    },
    GetAnchors: () => {
        return `/redesign/requestor/getcompanyname`
    },
    VendorList: () => {
        return `/redesign/admin/requestor-list`
    },
    InvestorList: () => {
        return `/redesign/admin/investors-list`
    },
    InvestorDetails: () => {
        return `/redesign/admin/investor-details`
    },
    InvestorBeneficiaryAccount: () => {
        return `/redesign/admin/investor-beneficiary-account`
    },
    InvestorEditContact: () => {
        return `/redesign/admin/investor-edit-contact`
    },
    InvestorUpdateBeneficiary: () => {
        return `/redesign/admin/investor-update-beneficiary`
    },
    InvestorEmailPreferences: () => {
        return `/redesign/admin/investor-email-preferences`
    },
    InvestorUpdateEmailPreference: () => {
        return `/redesign/admin/investor-update-email-preference`
    },
    VendorDetails: () => {
        return `/redesign/admin/requestor-details`
    },
    VendorAnchorLetters: () => {
        return `/redesign/admin/requestor-anchor-letters`
    },
    VendorBeneficiaryAccount: () => {
        return `/redesign/admin/requestor-beneficiary-account`
    },
    BankCodes: () => {
        return `/redesign/admin/bank-codes`
    },
    VendorUpdateBeneficiary: () => {
        return `/redesign/admin/requestor-update-beneficiary`
    },
    VendorEditContact: () => {
        return `/redesign/admin/requestor-edit-contact`
    },
    VendorEmailPreferences: () => {
        return `/redesign/admin/requestor-email-preferences`
    },
    VendorUpdateEmailPreference: () => {
        return `/redesign/admin/requestor-update-email-preference`
    },
    GrowthPartnerList: () => {
        return `/redesign/admin/growth-partner-list`
    },
    GrowthPartnerDetails: () => {
        return `/redesign/admin/growth-partner-details`
    },
    GrowthPartnerEditContact: () => {
        return `/redesign/admin/growth-partner-edit-contact`
    },
    GuarantorList: () => {
        return `/redesign/admin/guarantor-list`
    },
    GuarantorDetails: (id) => {
        return `/redesign/admin/guarantor-details`
    },
    AddGuarantor: () => {
        return `/redesign/admin/add-guarantor`
    },
    GuarantorDetails: (id) => {
        return `/dashboard/a/guarantorDetails/${id}`
    },
    AddGuarantor: () => {
        return `/dashboard/a/addGuarantor`
    },
    TransactionVolumeList: () => {
        return `/redesign/admin/transaction-volume-list`
    },
    AdminInvoicesList: () => {
        return `/redesign/admin/invoices-list`
    },
    AdminInvoiceDelete: () => {
        return `/redesign/admin/invoice-delete`
    },
    AdminInvoiceCancelBid: () => {
        return `/redesign/admin/invoice-cancel-accepted-bid`
    },
    AdminRFInvoiceList: () => {
        return `/redesign/admin/rf-invoice-list`
    },
    AdminRRList: () => {
        return `/redesign/admin/rr-list`
    },
    AdminAssetList: () => {
        return `/redesign/admin/asset-list`
    },
    AdminAnchorInvoices: () => {
        return `/dashboard/a/anchorInvoices`
    },
    AdminRecurringRevenue: () => {
        return `/dashboard/a/recurringRevenue`
    },
    AdminAssets: () => {
        return `/dashboard/a/assets`
    },
    CheckInvoiceNumber: () => {
        return `/redesign/requestor/checkInvoiceExists`
    },
    UploadInvoice: () => {
        return `/redesign/requestor/invoiceupload`
    },
    UploadInvoiceAnchor: () => {
        return `/redesign/anchor/invoiceUploadAnchor`
    },
    UploadInvoiceBulk: () => {
        return `/redesign/anchor/invoiceBulkUpload`
    },
    UploadInvoiceMulti: () => {
        return `/redesign/anchor/invoiceMultiUpload`
    },
    AnchorReuploadInvoice: () => {
        return `/redesign/anchor/reuploadInvoice`
    },
    InvoiceSplit: () => {
        return `/redesign/requestor/invoiceSplitNum`
    },
    CheckInvoiceSplit: () => {
        return `/dashboard/r/invoiceSplitNum`
    },
    EditInvoice: () => {
        return `/redesign/requestor/editInvoice`
    },
    InvoiceEditAnchor: () => {
        return `/redesign/anchor/invoiceEditAnchor`
    },
    MassReviewRFInv: () => {
        return `/redesign/anchor/massReviewRFInv`
    },
    MassApproveRFInv: () => {
        return `/redesign/anchor/massApproveRFInv`
    },
    AcceptBid: () => {
        return `/redesign/requestor/acceptProposal`
    },
    RevenueBidAction:() =>{ 
     return '/redesign/requestor/revenueBidActions'
    },
    RevenueList: () => {
        return `/redesign/requestor/addRevenueList `
    },
    PresentRevenue: () => {
        return `/redesign/requestor/presentRevenue`
    },
    Revenues: () => {
        return `/redesign/requestor/revenueList`
    },
    BidHistory: () => {
        return `/redesign/requestor/bid-history`
    },
    HistoryDetails: () => {
        return `/redesign/requestor/history-details`
    },
    LoadAgreement: () => {
        return `/redesign/requestor/loadPurchaseAgreement`
    },
    LoadRevenueAgreement:()=>{
    return '/redesign/requestor/revenuePurchaseAgreement'
    },
    
    // Vendor Invite List
    VendorInviteList: () => {
        return `/redesign/anchor/vendorInviteList`
    },
    SendVendorInvite: () => {
        return `/redesign/anchor/vendorInvite`
    },
    ConsentAction: () => {
        return `/redesign/requestor/consentActions`
    },


    // Investor
    InvestorDashboard: () => {
        return `/redesign/investor/investor_dashboard`
    },
    Portfolio: () => {
        return `/redesign/investor/portfolio`
    },
    InvestorFinalDeals: () => {
        return `/redesign/investor/final`
    },
    InvoiceBuyNowAction: () => {
        return `/redesign/investor/invoiceBuyNowAction`
    },
    PlaceBid: () => {
        return `/redesign/investor/deals-proposal-send`
    },
    ResellPlaceBid: () => {
        return `/redesign/investor/resellPlaceBid`
    },
    EditBid: () => {
        return `/redesign/investor/editBid`
    },
    DeleteBid: () => {
        return `/redesign/investor/deleteBid`
    },
    TradeAssetDeals: () => {
        return `/redesign/investor/tradeAssetDeals`
    },
    AssetList: () => {
        return `/redesign/investor/assetList`
    },
    EditAsset: () => {
        return `/redesign/investor/editAsset`
    },
    DeleteAsset: () => {
        return `/redesign/investor/deleteAsset`
    },
    ResellRevenueBidDetails: () => {
        return `/redesign/investor/revDealsDetails`
    },
    AssetDetails: () => {
        return `/redesign/investor/assetDealsDetails`
    },
    ResellBidDetails: () => {
        return `/redesign/investor/bidDetails`
    },
    LiveSplits: () => {
        return `/redesign/investor/liveSplits`
    },
    CheckBalanceBuyNow: () => {
        return `/redesign/investor/check_balance_buynow`
    },
    DealsProposalSend: () => {
        return `/redesign/investor/deals-proposal-send`
    },
    PayBidConfirm: () => {
        return `/redesign/investor/payBidConfirm`
    },
    RevenuePayBidConfirm:()=>{
    return '/redesign/investor/recRevenuePayDiscount'
    },
    CheckCurrencyAccount: () => {
        return `/user/checkCurrencyAccount`
    },
    CreateCurrencyAccount: () => {
        return `/user/createCurrencyAccount`
    },
    InvoiceLiveDealsDetails: () => {
        return `/redesign/investor/invoiceLiveDealsDetails`
    },
    RecurringRevenueDeals: () => {
        return `/redesign/investor/recRevenueDeals`
    },
    TradeAssetDeals: () => {
        return `/redesign/investor/tradeAssetDeals`
    },
    InvestorBidHistory: () => {
        return `/redesign/investor/bid-history`
    },
    RevenueBidHistory: () => {
        return `/redesign/investor/recRevMyBids`
    },
    ResellBidsList: () => {
        return `/redesign/investor/resellBidsList`
    },
    ResellRevenueBidsList: () => {
        return `/redesign/investor/resellRevenueBidsList`
    },
    AssetHistory: () => {
        return `/redesign/investor/mytransactionsAsset`
    },
    RevenueHistory: () => {
        return `/redesign/investor/mytrxnsRec`
    },
    BidStatus: () => {
        return `/redesign/investor/bid-status`
    },
    DownloadContract: () => {
        return `/redesign/investor/downloadContract`
    },
    LoadPurchaseAgreement: () => {
        return `/redesign/investor/loadPurchaseAgreementInvestor`
    },
    RevenuePurchaseAgreement: () => {
        return `/redesign/requestor/revenuePurchaseAgreement`
    },
    RecRevenueBuyNow: () => {
        return `/redesign/investor/recRevenueBuyNow`
    },

    CheckBalanceAsset: () => {
        return `/redesign/investor/checkBalanceAsset`
    },
    LoadPurchaseAgreementAsset: () => {
        return `/redesign/investor/loadPurchaseAgreementAsset`
    },
    DigitalSignatureAsset: () => {
        return `/redesign/investor/digitalSignatureAsset`
    },
    TradeBuyNow: () => {
        return `/redesign/investor/tradeBuyNow`
    },
    AssetUpload: () => {
        return `/redesign/investor/assetUpload`
    },
    ListInvoiceForReselling: () => {
        return `/redesign/investor/listInvoiceForReselling`
    },
    InvestorUpcomingInvoices: (dueWhen) => {
        return `/redesign/investor/payment/upcoming-invoices?dueWhen=${dueWhen}`
    },

    // Onboarding - Common endpoints
    GetRFVendor: () => {
        return `/redesign/signup/getRFVendor`
    },
    Submit: () => {
        return `/redesign/signin/submit`
    },
    GetAllAnchors: () => {
        return `/redesign/signup/getAllAnchors`
    },
    SaveAnchors: () => {
        return `/redesign/signup/saveAnchors`
    },
    CheckBlockedPassword: () => {
        return `/redesign/signin/checkBlockedPassword`
    },
    SubmitData: () => {
        return `/redesign/signup/submitData`
    },
    SendOTP: () => {
        return `/redesign/signup/sendOTP`
    },
    VerifyOTP: () => {
        return `/redesign/signup/verifyOtp`
    },
    // Vendor-specific endpoints
    GetDirectorByRc: () => {
        return `/redesign/signup/get_directorByRc`
    },
    SaveDetails1: () => {
        return `/redesign/signup/savedetails1`
    },
    SaveDetails2: () => {
        return `/redesign/signup/savedetails2`
    },
    SaveDetails3: () => {
        return `/redesign/signup/savedetails3`
    },
    UpdateAddress: () => {
        return `/redesign/signup/updateAddress`
    },
    // Investor-specific endpoints - assuming same endpoints but with different payloads
    // In reality, the same endpoints may be used but with different data indicating user type

    // General API Calls

    AccountDetails: () => {
        return `/redesign/requestor/get-account-details`
    },
    TransaferFunds: () => {
        return `/redesign/requestor/fundsTransferLocal`
    },
    BankList: () => {
        return `/redesign/requestor/banks-list`
    },
    AddBeneficiary: () => {
        return `/redesign/requestor/addbene`
    },
    BankList: () => {
        return `/redesign/requestor/banks-list`
    },
    CheckWithdrawalAmount: () => {
        return `/redesign/requestor/checkWithDrawAmt`
    },
    Withdrawal: () => {
        return `/redesign/requestor/withDrawAmt`
    },
    ProfileDetails: () => {
        return `/redesign/requestor/profile_details`
    },
    UpdateProfile: () => {
        return `/redesign/requestor/update_profile`
    },

    PasswordReset: () => {
        return `/redesign/requestor/reset_password`
    },
    TransactionPinReset: () => {
        return `/redesign/requestor/updateTransactionPIN`
    },
    SetEmailPreference: () => {
        return `/redesign/requestor/setUserEmailPreferences`
    },
    GetEmailPreference: () => {
        return `/redesign/requestor/getUserEmailPreferences`
    },
    GetAllAnchors: () => {
        return `/redesign/requestor/getAllAnchors`
    },
    GetProfileAnchors: () => {
        return `/redesign/requestor/getAnchors`
    },
    SaveAnchor: () => {
        return `/redesign/requestor/saveAnchors`
    },
    AccountLetterDownload: () => {
        return `/redesign/requestor/accountletterdownload`
    },
    AccountLetterUpload: () => {
        return `/redesign/requestor/accountletterupload`
    },
    UpdateRevenueInformation: () => {
        return `/redesign/requestor/updateRevenueInfo`
    },
    DownloadRevenueInformation: () => {
        return `/redesign/requestor/donwloadRevenueInfo`
    },

    // Anchor Dashboard
    AnchorDashboard: () => {
        return `/redesign/anchor/dashboard`
    },
    AnchorRejectInvoice: () => {
        return `/redesign/anchor/reject`
    },
    AnchorUpdateInvoice: () => {
        return `/dashboard/a/updateInvoice`
    },
    AnchorApproveInvoice: () => {
        return `/redesign/anchor/approve`
    },
    AnchorInvoiceListRFSuperadmin: () => {
        return `/redesign/anchor/invoiceListRFSuperadmin`
    },
    AnchorInvoiceListRFSubadmin: () => {
        return `/redesign/anchor/invoiceListRFSubadmin`
    },

    // Payment APIs
    PaymentUpcomingToday: () => {
        return `/redesign/payment/upcoming/today`
    },
    PaymentPaid: () => {
        return `/redesign/payment/paid`
    },
    // Upcoming Payments - Time Buckets
    PaymentUpcoming0to7: () => {
        return `/redesign/payment/upcoming/0to7`
    },
    PaymentUpcoming8to30: () => {
        return `/redesign/payment/upcoming/8to30`
    },
    PaymentUpcoming31to60: () => {
        return `/redesign/payment/upcoming/31to60`
    },
    PaymentUpcoming61plus: () => {
        return `/redesign/payment/upcoming/gt60`
    },
    PaymentUpcomingOverdue: () => {
        return `/redesign/payment/upcoming/overdue`
    },

    // VAT List
    VatList: () => {
        return `/redesign/admin/vat-list`
    },

    // Account List for Transfer
    AccountListForTransfer: () => {
        return `/redesign/admin/account-list-for-transfer`
    },

    // Account
    AdminAccountOverview: () => {
        return `/redesign/admin/account-overview`
    },
    AdminAccountWithdraw: () => {
        return `/redesign/admin/account-withdraw`
    },
    AdminAccountTransactions: () => {
        return `/redesign/admin/account-transactions`
    },

    // Manual Settlement
    ManualSettlementInvoices: () => {
        return `/redesign/admin/settlement-rf-list`
    },
    SettlementInvoiceApply: () => {
        return `/redesign/admin/settlement-invoice-apply`
    },
    SettlementRFInvoiceApply: () => {
        return `/redesign/admin/settlement-rf-apply`
    },
    SettlementRevenueApply: () => {
        return `/redesign/admin/settlement-revenue-apply`
    },
    ManualSettlementRFInvoices: () => {
        return `/redesign/admin/settlement-rf-list`
    },
    ManualSettlementRevenues: () => {
        return `/redesign/admin/settlement-revenue-list`
    },
    ManualSettlementAssets: () => {
        return `/redesign/admin/settlement-asset-list`
    },

    // Transaction Ledger (Accounts)
    TransactionLedgerAccounts: () => {
        return `/redesign/admin/transaction-ledger-accounts`
    },

    // Transaction Ledger (Wallets)
    TransactionLedgerWallets: () => {
        return `/redesign/admin/transaction-ledger-wallets`
    },

    // Reconciliation
    Reconciliation: () => {
        return `/dashboard/a/reconciliation`
    },
    ReconciliationBalanceHistory: () => {
        return `/dashboard/a/reconciliation/balanceHistory`
    },
    ReconciliationAccountStatement: () => {
        return `/dashboard/a/reconciliation/accountStatement`
    },

    // Pending Accounts
    PendingVendors: () => {
        return `/dashboard/a/pendingAccounts/vendors`
    },
    PendingVendorDetails: (id) => {
        return `/dashboard/a/pendingAccounts/vendors/${id}`
    },
    PendingInvestors: () => {
        return `/dashboard/a/pendingAccounts/investors`
    },
    PendingInvestorDetails: (id) => {
        return `/dashboard/a/pendingAccounts/investors/${id}`
    },
    PendingGrowthPartners: () => {
        return `/dashboard/a/pendingAccounts/growthPartners`
    },
    PendingGrowthPartnerDetails: (id) => {
        return `/dashboard/a/pendingAccounts/growthPartners/${id}`
    },

    // Deleted Accounts
    DeletedVendors: () => {
        return `/dashboard/a/deletedAccounts/vendors`
    },
    DeletedInvestors: () => {
        return `/dashboard/a/deletedAccounts/investors`
    },
    DeletedAnchors: () => {
        return `/dashboard/a/deletedAccounts/anchors`
    },
    DeletedGrowthPartners: () => {
        return `/dashboard/a/deletedAccounts/growthPartners`
    },

    // Vendor Sweep-In List
    VendorSweepInList: () => {
        return `/dashboard/a/vendorSweepIn`
    },

    // Edit Invoice (Admin)
    AdminEditInvoiceList: () => {
        return `/dashboard/a/editInvoice/list`
    },
    AdminEditInvoiceDetails: () => {
        return `/dashboard/a/editInvoice/details`
    },
    AdminSaveEditedInvoice: () => {
        return `/dashboard/a/editInvoice/save`
    },
    AdminDeleteInvoice: () => {
        return `/dashboard/a/editInvoice/delete`
    },

    // Dashboard
    DashboardOverview: () => {
        return `/redesign/admin/dashboard/overview`
    },
    DashboardChart: () => {
        return `/redesign/admin/dashboard/transaction-volume-chart`
    },

    // Revenue Amount Sterling
    RevenueAmountSterling: () => {
        return `/dashboard/a/revenueAmount/sterling`
    },

    // Blocked Amount
    BlockedAmount: () => {
        return `/dashboard/a/blockedAmount`
    },
    UnblockAmount: () => {
        return `/dashboard/a/blockedAmount/unblock`
    },

    // Revenue Amount
    RevenueAmountInvoices: () => {
        return `/dashboard/a/revenueAmount/invoices`
    },
    RevenueAmountRevenues: () => {
        return `/dashboard/a/revenueAmount/revenues`
    },
    RevenueAmountAssets: () => {
        return `/dashboard/a/revenueAmount/assets`
    },

    // Revenue
    AdminRevenue: () => {
        return `/dashboard/a/revenue`
    },

    // Transfer Funds
    TransferBetweenAccounts: () => {
        return `/dashboard/a/transferFunds/between`
    },
    DebitFromAccount: () => {
        return `/dashboard/a/transferFunds/debit`
    },
    GetAccountOptions: () => {
        return `/dashboard/a/transferFunds/accounts`
    },

    // Push Notifications
    PushNotificationsList: () => {
        return `/dashboard/a/pushNotifications/list`
    },
    SendPushNotification: () => {
        return `/dashboard/a/pushNotifications/send`
    },
    SendBatchPushNotification: () => {
        return `/dashboard/a/pushNotifications/sendBatch`
    },
}
