import { ErrorHandler } from "../factories/errorHandler";
import { routes } from "./apiRoutes"
import HttpService from "./httpService"
import useFetchItem from "./useFetchItem"
import useMutateItem from "./useMutateItem";
import { toast } from "react-toastify";


const httpService = new HttpService()

// export const useGetVendorDashboard = (handleSuccess) => {
//   const { error, isLoading, mutateAsync, data } = useMutateItem({
//     mutationFn: async (payload) => {
//       const res = await httpService.postData(
//         payload,
//         routes.VendorDashboard()
//       );
//       return res?.data?.data
//     },
//     onSuccess: (res) => {
//       handleSuccess?.(res);
//     }
//   });
//   const errorMessage =
//     ErrorHandler(error);

//   return {
//     vendorDashboardAsync: mutateAsync,
//     vendorDashboardIsLoading: isLoading,
//     vendorDashboardError: errorMessage,
//     vendorDashboardData: data
//   };
// };

export const useGetInvestorDashboard = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvestorDashboard()
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
    investorDashboardAsync: mutateAsync,
    investorDashboardIsLoading: isLoading,
    investorDashboardError: errorMessage,
    investorDashboardData: data
  };
};

export const useGetInvestorFinalDeals = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvestorFinalDeals()
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
    investorFinalDealsAsync: mutateAsync,
    investorFinalDealsIsLoading: isLoading,
    investorFinalDealsError: errorMessage,
    investorFinalDealsData: data
  };
};

export const useGetRecurringRevenueDeals = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RecurringRevenueDeals()
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
    recurringRevenueDealsAsync: mutateAsync,
    recurringRevenueDealsIsLoading: isLoading,
    recurringRevenueDealsError: errorMessage,
    recurringRevenueDealsData: data
  };
};

export const useGetTradeAssetDeals = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.TradeAssetDeals()
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
    tradeAssetDealsAsync: mutateAsync,
    tradeAssetDealsIsLoading: isLoading,
    tradeAssetDealsError: errorMessage,
    tradeAssetDealsData: data
  };
};

export const useGetAssetList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AssetList()
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
    assetListAsync: mutateAsync,
    assetListIsLoading: isLoading,
    assetListError: errorMessage,
    assetListData: data
  };
};

export const useEditAsset = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.EditAsset()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    editAssetAsync: mutateAsync,
    editAssetIsLoading: isLoading,
    editAssetError: errorMessage,
    editAssetData: data
  };
};

export const useDeleteAsset = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DeleteAsset()
      );
      return res?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    deleteAssetAsync: mutateAsync,
    deleteAssetIsLoading: isLoading,
    deleteAssetError: errorMessage,
    deleteAssetData: data
  };
};

export const useGetPortfolio = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.Portfolio()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    portfolioAsync: mutateAsync,
    portfolioIsLoading: isLoading,
    portfolioError: errorMessage,
    portfolioData: data
  };
};

export const useInvoiceBuyNowAction = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvoiceBuyNowAction()
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
    invoiceBuyNowActionAsync: mutateAsync,
    invoiceBuyNowActionIsLoading: isLoading,
    invoiceBuyNowActionError: errorMessage,
    invoiceBuyNowActionData: data
  };
};

export const usePlaceBid = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.PlaceBid()
      );
      return res?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Place bid error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    placeBidAsync: mutateAsync,
    placeBidIsLoading: isLoading,
    placeBidError: errorMessage,
    placeBidData: data
  };
};

// Tab 2: Secondary Market - Resell Place Bid
export const useResellPlaceBid = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ResellPlaceBid()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Resell place bid error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    resellPlaceBidAsync: mutateAsync,
    resellPlaceBidIsLoading: isLoading,
    resellPlaceBidError: errorMessage,
    resellPlaceBidData: data
  };
};

// Tab 3: Revenue Streams - Edit Bid
export const useEditBid = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.EditBid()
      );
      return res?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Edit bid error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    editBidAsync: mutateAsync,
    editBidIsLoading: isLoading,
    editBidError: errorMessage,
    editBidData: data
  };
};

// Delete Bid - For Revenue and Invoice tabs
export const useDeleteBid = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DeleteBid()
      );
      return res?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Delete bid error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    deleteBidAsync: mutateAsync,
    deleteBidIsLoading: isLoading,
    deleteBidError: errorMessage,
    deleteBidData: data
  };
};

// Tab 4: Trade Assets - Buy Asset
export const useTradeAssetDeals = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.TradeAssetDeals()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Trade asset deals error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    tradeAssetDealsAsync: mutateAsync,
    tradeAssetDealsIsLoading: isLoading,
    tradeAssetDealsError: errorMessage,
    tradeAssetDealsData: data
  };
};

// Revenue Tab - View Details API
export const useResellRevenueBidDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ResellRevenueBidDetails()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Resell revenue bid details error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    resellRevenueBidDetailsAsync: mutateAsync,
    resellRevenueBidDetailsIsLoading: isLoading,
    resellRevenueBidDetailsError: errorMessage,
    resellRevenueBidDetailsData: data
  };
};

// Trade Asset Tab - View Details API
export const useAssetDetails = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AssetDetails()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Asset details error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    assetDetailsAsync: mutateAsync,
    assetDetailsIsLoading: isLoading,
    assetDetailsError: errorMessage,
    assetDetailsData: data
  };
};

// Secondary Market Tab - View Details API (Resell Bid Details)
export const useResellBidDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ResellBidDetails()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Resell bid details error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    resellBidDetailsAsync: mutateAsync,
    resellBidDetailsIsLoading: isLoading,
    resellBidDetailsError: errorMessage,
    resellBidDetailsData: data
  };
};

export const useCheckBalanceBuyNow = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.CheckBalanceBuyNow()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status
      if (res?.status !== "success") {
        const errorMsg = res?.message || "Balance check failed";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
        return;
      }
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Balance check error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    checkBalanceBuyNowAsync: mutateAsync,
    checkBalanceBuyNowIsLoading: isLoading,
    checkBalanceBuyNowError: errorMessage,
    checkBalanceBuyNowData: data
  };
};

export const useDealsProposalSend = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DealsProposalSend()
      );
      // Return the full response data to preserve status and message
      return res?.data;
    },
    onSuccess: (res) => {
      // Validate that the API returned a success status
      if (res?.status !== "success") {
        throw new Error(res?.message || "Failed to send purchase proposal");
      }
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    dealsProposalSendAsync: mutateAsync,
    dealsProposalSendIsLoading: isLoading,
    dealsProposalSendError: errorMessage,
    dealsProposalSendData: data
  };
};

export const useCheckCurrencyAccount = () => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.CheckCurrencyAccount()
      );
      return res?.data?.data
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    checkCurrencyAccountAsync: mutateAsync,
    checkCurrencyAccountIsLoading: isLoading,
    checkCurrencyAccountError: errorMessage,
    checkCurrencyAccountData: data
  };
};

export const useCreateCurrencyAccount = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.CreateCurrencyAccount()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    createCurrencyAccountAsync: mutateAsync,
    createCurrencyAccountIsLoading: isLoading,
    createCurrencyAccountError: errorMessage,
    createCurrencyAccountData: data
  };
};

export const useGetInvoiceLiveDealsDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvoiceLiveDealsDetails()
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
    invoiceLiveDealsDetailsAsync: mutateAsync,
    invoiceLiveDealsDetailsIsLoading: isLoading,
    invoiceLiveDealsDetailsError: errorMessage,
    invoiceLiveDealsDetailsData: data
  };
};

// Transaction History APIs
export const useGetBidHistory = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.InvestorBidHistory()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    bidHistoryAsync: mutateAsync,
    bidHistoryIsLoading: isLoading,
    bidHistoryError: errorMessage,
    bidHistoryData: data
  };
};

export const useGetRevenueBidHistory = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenueBidHistory()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    revenueBidHistoryAsync: mutateAsync,
    revenueBidHistoryIsLoading: isLoading,
    revenueBidHistoryError: errorMessage,
    revenueBidHistoryData: data
  };
};

export const useGetResellBidsList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ResellBidsList()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    resellBidsListAsync: mutateAsync,
    resellBidsListIsLoading: isLoading,
    resellBidsListError: errorMessage,
    resellBidsListData: data
  };
};

export const useGetResellRevenueBidsList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ResellRevenueBidsList()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    resellRevenueBidsListAsync: mutateAsync,
    resellRevenueBidsListIsLoading: isLoading,
    resellRevenueBidsListError: errorMessage,
    resellRevenueBidsListData: data
  };
};

export const useGetAssetHistory = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AssetHistory()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    assetHistoryAsync: mutateAsync,
    assetHistoryIsLoading: isLoading,
    assetHistoryError: errorMessage,
    assetHistoryData: data
  };
};

export const useGetRevenueHistory = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenueHistory()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    revenueHistoryAsync: mutateAsync,
    revenueHistoryIsLoading: isLoading,
    revenueHistoryError: errorMessage,
    revenueHistoryData: data
  };
};

export const useDownloadContract = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DownloadContract()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    downloadContractAsync: mutateAsync,
    downloadContractIsLoading: isLoading,
    downloadContractError: errorMessage,
    downloadContractData: data
  };
};

// Transaction Details API
export const useGetBidStatus = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.BidStatus()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    bidStatusAsync: mutateAsync,
    bidStatusIsLoading: isLoading,
    bidStatusError: errorMessage,
    bidStatusData: data
  };
};

// Load Purchase Agreement API
export const useLoadPurchaseAgreement = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.LoadPurchaseAgreement()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    loadPurchaseAgreementAsync: mutateAsync,
    loadPurchaseAgreementIsLoading: isLoading,
    loadPurchaseAgreementError: errorMessage,
    loadPurchaseAgreementData: data
  };
};
export const useinvoiceLiveDealsDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.invoiceLiveDealsDetails()
      );
      return res?.data?.data
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Resell bid details error:", err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    invoiceLiveDealsDetailsAsync: mutateAsync,
    invoiceLiveDealsDetailsLoading: isLoading,
    invoiceLiveDealsDetailsError: errorMessage,
    invoiceLiveDealsDetailsData: data
  };
};

// Pay Bid Confirmation API
export const usePayBidConfirm = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.PayBidConfirm()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status
      if (res?.status !== "success") {
        const errorMsg = res?.message || "Payment confirmation failed";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
        return;
      }
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Pay bid confirm error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    payBidConfirmAsync: mutateAsync,
    payBidConfirmIsLoading: isLoading,
    payBidConfirmError: errorMessage,
    payBidConfirmData: data
  };
};

//Revenue Pay Bid Confirmation API
export const useRevenuePayBidConfirm = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenuePayBidConfirm()
      );

      // IMPORTANT
      // Return API response directly
      // DO NOT throw for res="failed"
      return res?.data;
    },

    onSuccess: (res) => {
      handleSuccess?.(res);
    },

    onError: (err) => {
      console.error("Revenue payment error:", err);

      handleError?.(
        err?.response?.data || err
      );
    }
  });

  return {
    RevenuepayBidConfirmAsync: mutateAsync,
    RevenuepayBidConfirmIsLoading: isLoading,
    RevenuepayBidConfirmError: error,
    RevenuepayBidConfirmData: data
  };
};
// export const useRevenuePayBidConfirm = (handleSuccess, handleError) => {
//   const { error, isLoading, mutateAsync, data } = useMutateItem({
//     mutationFn: async (payload) => {
//       const res = await httpService.postData(
//         payload,
//         routes.RevenuePayBidConfirm()
//       );
//       return res?.data;
//     },
//     onSuccess: (res) => {
//       // Check if API returned success status
//       if (res?.status !== "success") {
//         const errorMsg = res?.message || "Payment confirmation failed";
//         toast.error(errorMsg);
//         handleError?.(new Error(errorMsg));
//         return;
//       }
//       handleSuccess?.(res);
//     },
//     onError: (err) => {
//       console.error("Pay bid confirm error:", err);
//       handleError?.(err);
//     }
//   });
//   const errorMessage = ErrorHandler(error);

//   return {
//     RevenuepayBidConfirmAsync: mutateAsync,
//     RevenuepayBidConfirmIsLoading: isLoading,
//     RevenuepayBidConfirmError: errorMessage,
//     RevenuepayBidConfirmData: data
//   };
// };

// Revenue Purchase Agreement API (for Buy Now flow - Tab 3)
export const useRevenuePurchaseAgreement = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RevenuePurchaseAgreement()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Revenue purchase agreement error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    revenuePurchaseAgreementAsync: mutateAsync,
    revenuePurchaseAgreementIsLoading: isLoading,
    revenuePurchaseAgreementError: errorMessage,
    revenuePurchaseAgreementData: data
  };
};

// Recurring Revenue Buy Now API (for Tab 3)
export const useRecRevenueBuyNow = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.RecRevenueBuyNow()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status
      // API returns {"res":"success","data":[],"messg":"All Set"}
      if (res?.res !== "success") {
        const errorMsg = res?.messg || "Revenue purchase failed";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
        return;
      }
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Recurring revenue buy now error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    recRevenueBuyNowAsync: mutateAsync,
    recRevenueBuyNowIsLoading: isLoading,
    recRevenueBuyNowError: errorMessage,
    recRevenueBuyNowData: data
  };
};

// Asset Buy Now - Check Balance
export const useCheckBalanceAsset = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.CheckBalanceAsset()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status AND passok is true
      if (res?.res === "success" && res?.data?.passok === true) {
        // Balance check passed - proceed to next step
        handleSuccess?.(res);
      } else {
        // Balance check failed - show error
        const errorMsg = res?.data?.text || res?.messg || "Insufficient balance. Please fund your account.";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
      }
    },
    onError: (err) => {
      console.error("Check balance asset error:", err);
      const errorMsg = err?.message || "Insufficient balance. Please fund your account.";
      toast.error(errorMsg);
      handleError?.(new Error(errorMsg));
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    checkBalanceAssetAsync: mutateAsync,
    checkBalanceAssetIsLoading: isLoading,
    checkBalanceAssetError: errorMessage,
    checkBalanceAssetData: data
  };
};

// Asset Buy Now - Load Purchase Agreement
export const useLoadPurchaseAgreementAsset = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.LoadPurchaseAgreementAsset()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Load purchase agreement asset error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    loadPurchaseAgreementAssetAsync: mutateAsync,
    loadPurchaseAgreementAssetIsLoading: isLoading,
    loadPurchaseAgreementAssetError: errorMessage,
    loadPurchaseAgreementAssetData: data
  };
};

// Asset Buy Now - Digital Signature
export const useDigitalSignatureAsset = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DigitalSignatureAsset()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Digital signature asset error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    digitalSignatureAssetAsync: mutateAsync,
    digitalSignatureAssetIsLoading: isLoading,
    digitalSignatureAssetError: errorMessage,
    digitalSignatureAssetData: data
  };
};

// Asset Buy Now - Trade Buy Now (Final)
export const useTradeBuyNow = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.TradeBuyNow()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status
      if (res?.res !== "success") {
        const errorMsg = res?.messg || "Asset purchase failed";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
        return;
      }
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Trade buy now error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    tradeBuyNowAsync: mutateAsync,
    tradeBuyNowIsLoading: isLoading,
    tradeBuyNowError: errorMessage,
    tradeBuyNowData: data
  };
};

// Asset Upload API
export const useAssetUpload = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postFormData(
        payload,
        routes.AssetUpload()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status
      if (res?.status !== "success") {
        const errorMsg = res?.message || "Asset upload failed";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
        return;
      }
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("Asset upload error:", err);
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    assetUploadAsync: mutateAsync,
    assetUploadIsLoading: isLoading,
    assetUploadError: errorMessage,
    assetUploadData: data
  };
};

// List Invoice for Reselling API
export const useListInvoiceForReselling = (handleSuccess, handleError) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ListInvoiceForReselling()
      );
      return res?.data;
    },
    onSuccess: (res) => {
      // Check if API returned success status
      if (res?.res !== "success") {
        const errorMsg = res?.messg || "Failed to list invoice for reselling";
        toast.error(errorMsg);
        handleError?.(new Error(errorMsg));
        return;
      }
      handleSuccess?.(res);
    },
    onError: (err) => {
      console.error("List invoice for reselling error:", err);
      toast.error(err?.message || "Failed to list invoice");
      handleError?.(err);
    }
  });
  const errorMessage = ErrorHandler(error);

  return {
    listInvoiceForResellingAsync: mutateAsync,
    listInvoiceForResellingIsLoading: isLoading,
    listInvoiceForResellingError: errorMessage,
    listInvoiceForResellingData: data
  };
};

