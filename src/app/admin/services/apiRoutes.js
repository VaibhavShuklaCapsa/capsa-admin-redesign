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
        return `/redesign/admin/guarantor-details`
    },
    AddGuarantor: () => {
        return `/redesign/admin/add-guarantor`
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
    AdminInvoiceEditDueDate: () => {
        return `/redesign/admin/invoice-edit-due-date`
    },
    AdminRFInvoiceList: () => {
        return `/redesign/admin/rf-invoice-list`
    },
    AdminRRList: () => {
        return `/redesign/admin/rr-list`
    },
    AdminRRReview: () => {
        return `/redesign/admin/rr-review`
    },
    AdminAssetList: () => {
        return `/redesign/admin/asset-list`
    },
    AdminAssetReview: () => {
        return `/redesign/admin/asset-review`
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
    AccountsByRole: () => {
        return `/redesign/admin/accounts-by-role`
    },

    // Manual Settlement
    ManualSettlementInvoices: () => {
        return `/redesign/admin/settlement-invoice-list`
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
    SettlementAssetApply: () => {
        return `/redesign/admin/settlement-asset-apply`
    },

    // Transaction Ledger (Accounts)
    TransactionLedgerAccounts: () => {
        return `/redesign/admin/transaction-ledger-accounts`
    },
    TransactionReverseAccounts: () => {
        return `/redesign/admin/transaction-reverse-accounts`
    },

    // Transaction Ledger (Wallets)
    TransactionLedgerWallets: () => {
        return `/redesign/admin/transaction-ledger-wallets`
    },
    TransactionWalletReverse: () => {
        return `/redesign/admin/transaction-wallet-reverse`
    },

    // Reconciliation
    Reconciliation: () => {
        return `/redesign/admin/reconciliation`
    },
    ReconciliationBalanceHistory: () => {
        return `/redesign/admin/balance-history`
    },
    ReconciliationAccountStatement: () => {
        return `/redesign/admin/account-transactions-download`
    },

    // Pending Accounts
    PendingVendors: () => {
        return `/redesign/admin/vendor-pending-list`
    },
    PendingVendorDetails: () => {
        return `/redesign/admin/vendor-details`
    },
    PendingVendorKycDocuments: () => {
        return `/redesign/admin/vendor-kyc-documents`
    },
    VerifyVendorBvn: () => {
        return `/redesign/admin/verify-bvn`
    },
    VerifyVendorTin: () => {
        return `/redesign/admin/verify-tin`
    },
    VerifyVendorNin: () => {
        return `/redesign/admin/verify-nin`
    },
    VendorKycDocAction: () => {
        return `/redesign/admin/vendor-kyc-doc-action`
    },
    VendorAccountLetters: () => {
        return `/redesign/admin/vendor-account-letters`
    },
    VendorAccountLetterAction: () => {
        return `/redesign/admin/vendor-account-letter-action`
    },
    CreateVendorAccount: () => {
        return `/redesign/admin/create-account`
    },
    PendingInvestors: () => {
        return `/redesign/admin/investor-pending-list`
    },
    PendingInvestorDetails: () => {
        return `/redesign/admin/pending-investor-details`
    },
    InvestorKycDocuments: () => {
        return `/redesign/admin/investor-kyc-documents`
    },
    InvestorKycDocAction: () => {
        return `/redesign/admin/investor-kyc-doc-action`
    },
    InvestorBankAccount: () => {
        return `/redesign/admin/investor-bank-account`
    },
    CreateInvestorAccount: () => {
        return `/redesign/admin/create-investor-account`
    },
    PendingGrowthPartners: () => {
        return `/redesign/admin/gp-pending-list`
    },
    PendingGrowthPartnerDetails: () => {
        return `/redesign/admin/gp-details`
    },
    GpKycDocuments: () => {
        return `/redesign/admin/gp-kyc-documents`
    },
    GpKycDocAction: () => {
        return `/redesign/admin/gp-kyc-doc-action`
    },

    // Deleted Accounts
    DeletedVendors: () => {
        return `/redesign/admin/deleted-vendors-list`
    },
    DeletedInvestors: () => {
        return `/redesign/admin/deleted-investors-list`
    },
    AnchorsList: () => {
        return `/redesign/admin/anchors-list`
    },
    AnchorDetails: () => {
        return `/redesign/admin/anchor-details`
    },
    AnchorEditGrade: () => {
        return `/redesign/admin/anchor-edit-grade`
    },
    AnchorChangeRate: () => {
        return `/redesign/admin/anchor-change-rate`
    },
    AnchorToggleRF: () => {
        return `/redesign/admin/anchor-toggle-rf`
    },
    AnchorEditEmail: () => {
        return `/redesign/admin/anchor-edit-email`
    },
    AnchorSubAdminList: () => {
        return `/redesign/admin/anchor-sub-admin-list`
    },
    AnchorSubAdminAdd: () => {
        return `/redesign/admin/anchor-sub-admin-add`
    },
    AnchorSubAdminDelete: () => {
        return `/redesign/admin/anchor-sub-admin-delete`
    },
    AnchorSubAdminEdit: () => {
        return `/redesign/admin/anchor-sub-admin-edit`
    },
    AddAnchorBusinessInfo: () => {
        return `/redesign/admin/add-anchor-business-info`
    },
    AddAnchorDocuments: () => {
        return `/redesign/admin/add-anchor-documents`
    },
    DeletedAnchors: () => {
        return `/redesign/admin/deleted-anchors-list`
    },
    DeletedGrowthPartners: () => {
        return `/redesign/admin/deleted-gp-list`
    },

    // Vendor Sweep-In List
    VendorSweepInList: () => {
        return `/redesign/admin/vendor-sweep-in-list`
    },

    // Edit Invoice (Admin)
    AdminEditInvoiceList: () => {
        return `/redesign/admin/edit-invoice-list`
    },
    AdminEditInvoiceAnchorsList: () => {
        return `/redesign/admin/edit-invoice-anchors-list`
    },
    AdminEditInvoiceDetails: () => {
        return `/redesign/admin/edit-invoice-details`
    },
    AdminEditInvoiceUpdate: () => {
        return `/redesign/admin/edit-invoice-update`
    },
    AdminDeleteInvoice: () => {
        return `/redesign/admin/edit-invoice-delete`
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
        return `/redesign/admin/revenue-amount-sterling-list`
    },

    // Blocked Amount
    BlockedAmount: () => {
        return `/redesign/admin/blocked-amount-list`
    },
    UnblockAmount: () => {
        return `/redesign/admin/blocked-amount-unblock`
    },

    // Revenue Amount
    RevenueAmountInvoices: () => {
        return `/redesign/admin/revenue-amount-invoice-list`
    },
    RevenueAmountRevenues: () => {
        return `/redesign/admin/revenue-amount-revenue-list`
    },
    RevenueAmountAssets: () => {
        return `/redesign/admin/revenue-amount-asset-list`
    },

    // Revenue
    AdminRevenue: () => {
        return `/redesign/admin/revenue-list`
    },

    // Transfer Funds
    TransferBetweenAccounts: () => {
        return `/redesign/admin/transfer-between-accounts`
    },
    DebitFromAccount: () => {
        return `/redesign/admin/debit-from-account`
    },
    TransferFundsAccountsList: () => {
        return `/redesign/admin/transfer-funds-accounts-list`
    },

    // Push Notifications
    PushNotificationsList: () => {
        return `/redesign/admin/push-notifications-user-list`
    },
    SendPushNotification: () => {
        return `/redesign/admin/push-send-single`
    },
    SendBatchPushNotification: () => {
        return `/redesign/admin/push-send-batch`
    },
}
