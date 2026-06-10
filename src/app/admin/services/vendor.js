import { ErrorHandler } from "../factories/errorHandler";
import { routes } from "./apiRoutes"
import HttpService from "./httpService"
import useFetchItem from "./useFetchItem"
import useMutateItem from "./useMutateItem";


const httpService = new HttpService()

// ════════════════════════════════════════════════════
// VENDOR APIS
// ════════════════════════════════════════════════════
export const useGetVendorDashboard = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.VendorDashboard()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    vendorDashboardAsync: mutateAsync,
    vendorDashboardIsLoading: isLoading,
    vendorDashboardError: errorMessage,
    vendorDashboardData: data
  };
};

export const useGetVendorDashboardRR = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.vendorDashboardRR()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    vendorDashboardRRAsync: mutateAsync,
    vendorDashboardRRIsLoading: isLoading,
    vendorDashboardRRError: errorMessage,
    vendorDashboardRRData: data
  };
};

export const useGetInvoiceList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvoiceList()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    invoiceListAsync: mutateAsync,
    invoiceListIsLoading: isLoading,
    invoiceListError: errorMessage,
    invoiceListData : data
  };
};

export const useGetBidList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetBids()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    bidListAsync: mutateAsync,
    bidListIsLoading: isLoading,
    bidListError: errorMessage,
    bidListData : data
  };
};

export const useGetRevenueBidList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenueBidsList()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    revenueBidListAsync: mutateAsync,
    revenueBidListIsLoading: isLoading,
    revenueBidListError: errorMessage,
    revenueBidListData : data
  };
};

export const useGetRevenueBidDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenueDetails()
      );
      return res?.data || res
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    revenueBidDetailAsync: mutateAsync,
    revenueBidDetailIsLoading: isLoading,
    revenueBidDetailError: errorMessage,
    revenueBidDetailData : data
  };
};

export const useGetBidDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetBidDetail()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    bidDetailAsync: mutateAsync,
    bidDetailIsLoading: isLoading,
    bidDetailError: errorMessage,
    bidDetailData : data
  };
};

export const useGetInvoiceDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetInvoiceDetails()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    invoiceDetailAsync: mutateAsync,
    invoiceDetailIsLoading: isLoading,
    invoiceDetailError: errorMessage,
    invoiceDetailData : data
  };
};

export const useGetInvoiceDetailsRequestor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [INVOICE DETAILS REQUESTOR] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.GetInvoiceDetailsRequestor()
      );
      console.log("📥 [INVOICE DETAILS REQUESTOR] Full API response:", res?.data);
      return res?.data?.data
    },
    onSuccess: (res) => {
      console.log("✅ [INVOICE DETAILS REQUESTOR] Success callback:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    invoiceDetailAsync: mutateAsync,
    invoiceDetailIsLoading: isLoading,
    invoiceDetailError: errorMessage,
    invoiceDetailData : data
  };
};

export const useGetAnchorInvoiceDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [ANCHOR INVOICE DETAILS] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.GetAnchorInvoiceDetails()
      );
      console.log("📥 [ANCHOR INVOICE DETAILS] Full API response:", res?.data);
      return res?.data?.data
    },
    onSuccess: (res) => {
      console.log("✅ [ANCHOR INVOICE DETAILS] Success callback:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    anchorInvoiceDetailAsync: mutateAsync,
    anchorInvoiceDetailIsLoading: isLoading,
    anchorInvoiceDetailError: errorMessage,
    anchorInvoiceDetailData : data
  };
};
export const useGetInvoiceFile = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [INVOICE FILE] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.GetAnchorInvoiceFile()
      );
      console.log("📥 [INVOICE FILE] Full API Response:", res);
      console.log("📦 [INVOICE FILE] Extracting res.data:", res?.data);
      return res?.data;  // Return the entire data object
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    getInvoiceFileAsync: mutateAsync,
    getInvoiceFileIsLoading: isLoading,
    getInvoiceFileError: errorMessage,
    getInvoiceFileData : data
  };
};
export const useRejectInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [REJECT INVOICE] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.AnchorRejectInvoice()
      );
      console.log("📥 [REJECT INVOICE] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    rejectInvoiceAsync: mutateAsync,
    rejectInvoiceIsLoading: isLoading,
    rejectInvoiceError: errorMessage,
    rejectInvoiceData : data
  };
};
export const useUpdateInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [UPDATE INVOICE] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.AnchorUpdateInvoice()
      );
      console.log("📥 [UPDATE INVOICE] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    updateInvoiceAsync: mutateAsync,
    updateInvoiceIsLoading: isLoading,
    updateInvoiceError: errorMessage,
    updateInvoiceData : data
  };
};
export const useRequestApproval = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [REQUEST APPROVAL] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.RequestApproval()
      );
      console.log("📥 [REQUEST APPROVAL] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    requestApprovalAsync: mutateAsync,
    requestApprovalIsLoading: isLoading,
    requestApprovalError: errorMessage,
    requestApprovalData : data
  };
};

// New hook for invoiceEditAnchor - used by Reviewer sub-admin type
export const useInvoiceEditAnchor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [INVOICE EDIT ANCHOR] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.InvoiceEditAnchor()
      );
      console.log("📥 [INVOICE EDIT ANCHOR] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    invoiceEditAnchorAsync: mutateAsync,
    invoiceEditAnchorIsLoading: isLoading,
    invoiceEditAnchorError: errorMessage,
    invoiceEditAnchorData : data
  };
};

export const useAnchorReuploadInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [ANCHOR REUPLOAD INVOICE] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.AnchorReuploadInvoice()
      );
      console.log("📥 [ANCHOR REUPLOAD INVOICE] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    anchorReuploadInvoiceAsync: mutateAsync,
    anchorReuploadInvoiceIsLoading: isLoading,
    anchorReuploadInvoiceError: errorMessage,
    anchorReuploadInvoiceData: data
  };
};

// ════════════════════════════════════════════════════
// MASS REVIEW RF INVOICE API (For Reviewer bulk verify)
// Endpoint: /redesign/anchor/massReviewRFInv
// ════════════════════════════════════════════════════
export const useMassReviewRFInv = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [MASS REVIEW RF INV] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.MassReviewRFInv()
      );
      console.log("📥 [MASS REVIEW RF INV] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("✅ [MASS REVIEW RF INV] API Success:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    massReviewRFInvAsync: mutateAsync,
    massReviewRFInvIsLoading: isLoading,
    massReviewRFInvError: errorMessage,
    massReviewRFInvData: data
  };
};

// ════════════════════════════════════════════════════
// MASS APPROVE RF INVOICE API (For Approver bulk approve)
// Endpoint: /redesign/anchor/massApproveRFInv
// ════════════════════════════════════════════════════
export const useMassApproveRFInv = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [MASS APPROVE RF INV] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.MassApproveRFInv()
      );
      console.log("📥 [MASS APPROVE RF INV] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("✅ [MASS APPROVE RF INV] API Success:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    massApproveRFInvAsync: mutateAsync,
    massApproveRFInvIsLoading: isLoading,
    massApproveRFInvError: errorMessage,
    massApproveRFInvData: data
  };
};
export const useAnchorApproveInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [ANCHOR APPROVE] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.AnchorApproveInvoice()
      );
      console.log("📥 [ANCHOR APPROVE] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    anchorApproveInvoiceAsync: mutateAsync,
    anchorApproveInvoiceIsLoading: isLoading,
    anchorApproveInvoiceError: errorMessage,
    anchorApproveInvoiceData : data
  };
};
export const useApproveInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ApproveInvoice()
      );
      console.log("📦 Approve Invoice API Response:", res?.data);
      if (res?.data?.status !== 'success') {
        throw new Error(res?.data?.message || 'Approval failed');
      }
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    approveInvoiceAsync: mutateAsync,
    approveInvoiceIsLoading: isLoading,
    approveInvoiceError: errorMessage,
    approveInvoiceData : data
  };
};
export const useDeleteInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DeleteInvoice()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    deleteInvoiceAsync: mutateAsync,
    deleteInvoiceIsLoading: isLoading,
    deleteInvoiceError: errorMessage,
    deleteInvoiceData : data
  };
};

export const useDeleteAnchorInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DeleteInvoiceAnchor()
      );
      return res?.data?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    deleteAnchorInvoiceAsync: mutateAsync,
    deleteAnchorInvoiceIsLoading: isLoading,
    deleteAnchorInvoiceError: errorMessage,
    deleteAnchorInvoiceData : data
  };
};

export const useDeleteRevenue = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DeleteRevenue()
      );
      return res?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    deleteRevenueAsync: mutateAsync,
    deleteRevenueIsLoading: isLoading,
    deleteRevenueError: errorMessage,
    deleteRevenueData : data
  };
};

export const useEditRevenue = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.EditRevenue()
      );
      return res?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    editRevenueAsync: mutateAsync,
    editRevenueIsLoading: isLoading,
    editRevenueError: errorMessage,
    editRevenueData : data
  };
};

export const useGetAnchors = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetAnchors()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    getAnchorsAsync: mutateAsync,
    getAnchorsIsLoading: isLoading,
    getAnchorsError: errorMessage,
    getAnchorsData : data
  };
};

export const useCheckInvoiceExist = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.CheckInvoiceNumber()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    checkInvoiceExistAsync: mutateAsync,
    checkInvoiceExistIsLoading: isLoading,
    checkInvoiceExistError: errorMessage,
    checkInvoiceExistData : data
  };
};

// ════════════════════════════════════════════════════
// CHECK INVOICE SPLIT API (Vendor/Requestor side - before preview)
// Uses endpoint /redesign/requestor/invoiceSplitNum
// ════════════════════════════════════════════════════
export const useCheckInvoiceSplitAnchor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Invoice Split Check API (Vendor/Requestor) with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.InvoiceSplit()  // ✅ Changed to /redesign/requestor/invoiceSplitNum
      );
      console.log("📦 Invoice Split Check API Response:", res?.data);
      return res?.data?.data  // ✅ Return the data array from response
    },
    onSuccess: (res) => {
      console.log("✅ Invoice Split Check API Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    checkInvoiceSplitAnchorAsync: mutateAsync,
    checkInvoiceSplitAnchorIsLoading: isLoading,
    checkInvoiceSplitAnchorError: errorMessage,
    checkInvoiceSplitAnchorData: data
  };
};

// ════════════════════════════════════════════════════
// VENDOR LIST API (for Anchor to get their vendors)
// ════════════════════════════════════════════════════
export const useGetVendorList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Vendor List API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.GetVendorList()
      );
      console.log("📦 Vendor List API Response:", res?.data);
      return res?.data
    },
    onSuccess: (res) => {
      console.log("✅ Vendor List API Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    getVendorListAsync: mutateAsync,
    getVendorListIsLoading: isLoading,
    getVendorListError: errorMessage,
    getVendorListData: data
  };
};

// ════════════════════════════════════════════════════
// ANCHOR APIS (BUYER role)
// ════════════════════════════════════════════════════
export const useGetInvoiceListRFSuperadmin = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Anchor Invoice List API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.AnchorInvoiceListRFSuperadmin()
      );
      console.log("📥 API Response:", res?.data);
      return res?.data?.data
    },
    onSuccess: (res) => {
      console.log("✅ Anchor Invoice List API Success:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    invoiceListRFSuperadminAsync: mutateAsync,
    invoiceListRFSuperadminIsLoading: isLoading,
    invoiceListRFSuperadminError: errorMessage,
    invoiceListRFSuperadminData: data
  };
};

// ════════════════════════════════════════════════════
// SUB-ADMIN APIS
// ════════════════════════════════════════════════════
export const useGetInvoiceListRFSubadmin = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [SUB-ADMIN] Calling Invoice List API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.AnchorInvoiceListRFSubadmin()
      );
      console.log("📥 [SUB-ADMIN] API Response:", res?.data);
      // Extract invoices array and dashboardData from response
      const extractedData = res?.data?.data?.invoices || [];
      const dashboardData = res?.data?.data?.dashboardData || {};
      console.log("📦 [SUB-ADMIN] Extracted Invoices:", extractedData);
      console.log("📊 [SUB-ADMIN] Extracted Dashboard Data:", dashboardData);
      return { invoices: extractedData, dashboardData };
    },
    onSuccess: (res) => {
      console.log("✅ [SUB-ADMIN] Invoice List API Success:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    invoiceListRFSubadminAsync: mutateAsync,
    invoiceListRFSubadminIsLoading: isLoading,
    invoiceListRFSubadminError: errorMessage,
    invoiceListRFSubadminData: data
  };
};

export const useUploadInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Upload Invoice API (Vendor) with payload:", payload);
      console.log("📦 FormData entries:");
      for (let pair of payload.entries()) {
        console.log(`  - ${pair[0]}:`, pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }
      const res = await httpService.postData(
        payload,
        routes.UploadInvoice()
      );
      console.log("📦 Upload Invoice API Response:", res?.data);
      if (res?.data?.status !== 'success') {
        throw new Error(res?.data?.message || 'Upload failed');
      }
      return res?.data?.data
    },
    onSuccess: (res) => {
      console.log("✅ Upload Invoice API Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    uploadInvoiceAsync: mutateAsync,
    uploadInvoiceIsLoading: isLoading,
    uploadInvoiceError: errorMessage,
    uploadInvoiceData : data
  };
};

// ════════════════════════════════════════════════════
// UPLOAD INVOICE ANCHOR API (Final submission)
// Endpoint: /redesign/anchor/invoiceUploadAnchor
// ════════════════════════════════════════════════════
export const useUploadInvoiceAnchor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Upload Invoice Anchor API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.UploadInvoiceAnchor()
      );
      console.log("📦 Upload Invoice Anchor API Response:", res?.data);
      return res?.data
    },
    onSuccess: (res) => {
      console.log("✅ Upload Invoice Anchor API Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    uploadInvoiceAnchorAsync: mutateAsync,
    uploadInvoiceAnchorIsLoading: isLoading,
    uploadInvoiceAnchorError: errorMessage,
    uploadInvoiceAnchorData: data
  };
};

// ════════════════════════════════════════════════════
// SAVE DRAFT INVOICE API (For vendor/company users)
// Endpoint: /redesign/requestor/invoiceupload
// ════════════════════════════════════════════════════
export const useSaveDraftInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Save Draft Invoice API with payload:", payload);
      console.log("📦 FormData entries:");
      for (let pair of payload.entries()) {
        console.log(`  - ${pair[0]}:`, pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
      }
      const res = await httpService.postData(
        payload,
        routes.UploadInvoice()
      );
      console.log("📦 Save Draft Invoice API Response:", res?.data);
      if (res?.data?.status !== 'success') {
        throw new Error(res?.data?.message || 'Draft save failed');
      }
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("✅ Save Draft Invoice API Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    saveDraftInvoiceAsync: mutateAsync,
    saveDraftInvoiceIsLoading: isLoading,
    saveDraftInvoiceError: errorMessage,
    saveDraftInvoiceData: data
  };
};

export const useCheckInvoiceSplit = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvoiceSplit()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    checkInvoiceSplitAsync: mutateAsync,
    checkInvoiceSplitIsLoading: isLoading,
    checkInvoiceSplitError: errorMessage,
    checkInvoiceSplitData : data
  };
};

export const useEditInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.EditInvoice()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    editInvoiceAsync: mutateAsync,
    editInvoiceIsLoading: isLoading,
    editInvoiceError: errorMessage,
    editInvoiceData : data
  };
};

export const useAcceptProposal = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AcceptBid()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    acceptProposalAsync: mutateAsync,
    acceptProposalIsLoading: isLoading,
    acceptProposalError: errorMessage,
    acceptProposalData : data
  };
};


export const useRevenueAcceptProposal = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenueBidAction()
      );

      return res?.data;
    },

    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });

  const errorMessage = ErrorHandler(error);

  return {
    acceptRevenueProposalAsync: mutateAsync,
    acceptRevenueProposalIsLoading: isLoading,
    acceptRevenueProposalError: errorMessage,
    acceptRevenueProposalData: data
  };
};

export const useGetRevenueList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [REVENUE LIST] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.RevenueList()
      );
      console.log("📥 [REVENUE LIST] Full API Response:", res);
      console.log("📥 [REVENUE LIST] Returning res?.data:", res?.data);
      return res?.data  // Return the entire data object
    },
    onSuccess: (res) => {
      console.log("✅ [REVENUE LIST] API Success:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    revenueListAsync: mutateAsync,
    revenueListIsLoading: isLoading,
    revenueListError: errorMessage,
    revenueListData : data
  };
};

// PRESENT REVENUE API (For selling revenue)
// Endpoint: /redesign/requestor/presentRevenue

export const usePresentRevenue = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 [PRESENT REVENUE] Calling API with payload:", payload);
      const res = await httpService.postData(
        payload,
        routes.PresentRevenue()
      );
      console.log("📥 [PRESENT REVENUE] Full API Response:", res);
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("✅ [PRESENT REVENUE] API Success:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    presentRevenueAsync: mutateAsync,
    presentRevenueIsLoading: isLoading,
    presentRevenueError: errorMessage,
    presentRevenueData: data
  };
};

export const useGetRevenues = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.Revenues()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    getRevenueListAsync: mutateAsync,
    getRevenueListIsLoading: isLoading,
    getRevenueListError: errorMessage,
    getRevenueListData : data
  };
};

export const useGetHistory = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.BidHistory()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    getHistoryAsync: mutateAsync,
    getHistoryIsLoading: isLoading,
    getHistoryError: errorMessage,
    getHistoryData : data
  };
};

export const useGetHistoryDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.HistoryDetails()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    historyDetailsAsync: mutateAsync,
    historyDetailsIsLoading: isLoading,
    historyDetailsError: errorMessage,
    historyDetailsData : data
  };
};

export const useGetPurchaseRevenueAgreement = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.LoadRevenueAgreement()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

return {
  loadAgreementRevenueAsync: mutateAsync,
  loadAgreementRevenueIsLoading: isLoading,
  loadAgreementRevenueError: errorMessage,
  loadAgreementRevenueData: data
};
};


export const useGetPurchaseAgreement = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.LoadAgreement()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    loadAgreementAsync: mutateAsync,
    loadAgreementIsLoading: isLoading,
    loadAgreementError: errorMessage,
    loadAgreementData : data
  };
};

export const useGetConsent = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ConsentAction()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage =
    ErrorHandler(error);

  return {
    getConsentAsync: mutateAsync,
    getConsentIsLoading: isLoading,
    getConsentError: errorMessage,
    getConsentData : data
  };
};

// ════════════════════════════════════════════════════
// BULK UPLOAD INVOICE API (API #1 - CSV Upload)
// Endpoint: /dashboard/a/invoiceBulkUpload
// ════════════════════════════════════════════════════
export const useBulkUploadInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async ({ file, panNumber }) => {
      console.log("📡 Calling Bulk Upload Invoice API...");
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('panNumber', panNumber);
      formData.append('web', 'true');
      
      // Generate filename: {panNumber}_{timestamp}.csv
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'csv';
      const fileName = `${panNumber}_${timestamp}.${extension}`;
      
      console.log("📁 Uploading file:", fileName);
      formData.append('file', file, fileName);
      
      const res = await httpService.postData(formData, routes.UploadInvoiceBulk());
      console.log("📦 Bulk Upload Response:", res?.data);
      return res?.data;
    },
    onSuccess: (res) => {
      console.log("✅ Bulk Upload Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    bulkUploadAsync: mutateAsync,
    bulkUploadIsLoading: isLoading,
    bulkUploadError: errorMessage,
    bulkUploadData: data
  };
};

// ════════════════════════════════════════════════════
// MULTI UPLOAD CONFIRM API (API #2 - Final confirmation)
// Endpoint: /redesign/anchor/invoiceMultiUpload
// ════════════════════════════════════════════════════
export const useMultiUploadInvoice = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      console.log("📡 Calling Multi Upload Confirm API with payload:", payload);
      
      // Check if payload is FormData (for file upload)
      if (payload instanceof FormData) {
        console.log("📦 Sending FormData to API:");
        console.log("  - file:", payload.get('file')?.name);
        console.log("  - panNumber:", payload.get('panNumber'));
        
        // Use httpService.postData with FormData
        const res = await httpService.postData(payload, routes.UploadInvoiceMulti(), {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("📦 Multi Upload Confirm Response:", res?.data);
        return res?.data;
      } else {
        // Fallback for old format (if needed)
        console.log("⚠️ Received non-FormData payload (legacy format?):", payload);
        const res = await httpService.postData(payload, routes.UploadInvoiceMulti());
        console.log("📦 Multi Upload Confirm Response:", res?.data);
        return res?.data;
      }
    },
    onSuccess: (res) => {
      console.log("✅ Multi Upload Confirm Callback - Processing response:", res);
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    multiUploadAsync: mutateAsync,
    multiUploadIsLoading: isLoading,
    multiUploadError: errorMessage,
    multiUploadData: data
  };
};

