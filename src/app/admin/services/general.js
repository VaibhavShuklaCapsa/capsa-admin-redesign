import { ErrorHandler } from "../factories/errorHandler";
import { routes } from "./apiRoutes"
import HttpService from "./httpService"
import useFetchItem from "./useFetchItem"
import useMutateItem from "./useMutateItem";


const httpService = new HttpService()

export const useGetAccountDetails = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AccountDetails()
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
    accountDetailsAsync: mutateAsync,
    accountDetailsIsLoading: isLoading,
    accountDetailsError: errorMessage,
    accountDetailsData: data
  };
};

export const useTransferFunds = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.TransaferFunds()
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
    transferFundsAsync: mutateAsync,
    transferFundsIsLoading: isLoading,
    transferFundsError: errorMessage,
    transferFundsData: data
  };
};

export const useAddBeneficiary = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AddBeneficiary()
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
    addBeneficiaryAsync: mutateAsync,
    addBeneficiaryIsLoading: isLoading,
    addBeneficiaryError: errorMessage,
    addBeneficiaryData: data
  };
};

export const useBankList = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async () => {
      const res = await httpService.postData(
        {},
        routes.BankList()
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
    bankListAsync: mutateAsync,
    bankListIsLoading: isLoading,
    bankListError: errorMessage,
    bankListData: data
  };
};

export const useCheckWithdrawal = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.CheckWithdrawalAmount()
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
    checkWithdrawalAsync: mutateAsync,
    checkWithdrawalIsLoading: isLoading,
    checkWithdrawalError: errorMessage,
    checkWithdrawalData: data
  };
};

export const useWithdrawal = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.Withdrawal()
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
    withdrawalAsync: mutateAsync,
    withdrawalIsLoading: isLoading,
    withdrawalError: errorMessage,
    withdrawalData: data
  };
};

export const useProfileDetail = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.ProfileDetails()
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
    profileAsync: mutateAsync,
    profileIsLoading: isLoading,
    profileError: errorMessage,
    profileData: data
  };
};

export const useUpdateProfile = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.UpdateProfile()
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
    updateProfileAsync: mutateAsync,
    updateProfileIsLoading: isLoading,
    updateProfileError: errorMessage,
    updateProfileData: data
  };
};

export const useUpdateAddress = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.UpdateAddress()
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
    updateAddressAsync: mutateAsync,
    updateAddressIsLoading: isLoading,
    updateAddressError: errorMessage,
    updateAddressData: data
  };
};

export const useUpdatePassword = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.PasswordReset()
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
    updatePasswordAsync: mutateAsync,
    updatePasswordIsLoading: isLoading,
    updatePasswordError: errorMessage,
    updatePasswordData: data
  };
};

export const useResetTransactionPin = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.TransactionPinReset()
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
    updateTransactionPinAsync: mutateAsync,
    updateTransactionPinIsLoading: isLoading,
    updateTransactionPinError: errorMessage,
    updateTransactionPinData: data
  };
};

export const useSetEmailPreference = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.SetEmailPreference()
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
    setEmailPreferenceAsync: mutateAsync,
    setEmailPreferenceIsLoading: isLoading,
    setEmailPreferenceError: errorMessage,
    setEmailPreferenceData: data
  };
};

export const useGetEmailPreference = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetEmailPreference()
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
    getEmailPreferenceAsync: mutateAsync,
    getEmailPreferenceIsLoading: isLoading,
    getEmailPreferenceError: errorMessage,
    getEmailPreferenceData: data
  };
};

export const useGetAllAnchors = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetAllAnchors()
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
    getAllAnchorsAsync: mutateAsync,
    getAllAnchorsIsLoading: isLoading,
    getAllAnchorsError: errorMessage,
    getAllAnchorsData: data
  };
};

export const useGetProfileAnchor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.GetProfileAnchors()
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
    getProfileAnchorAsync: mutateAsync,
    getProfileAnchorIsLoading: isLoading,
    getProfileAnchorError: errorMessage,
    getProfileAnchorData: data
  };
};

export const useSaveAnchor = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.SaveAnchor()
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
    saveAnchorAsync: mutateAsync,
    saveAnchorIsLoading: isLoading,
    saveAnchorError: errorMessage,
    saveAnchorData: data
  };
};

export const useAccountLetter = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AccountLetterDownload()
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
    accountLetterAsync: mutateAsync,
    accountLetterIsLoading: isLoading,
    accountLetterError: errorMessage,
    accountLetterData: data
  };
};

export const useUploadAccountLetter = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.AccountLetterUpload()
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
    uploadAccountLetterAsync: mutateAsync,
    uploadAccountLetterIsLoading: isLoading,
    uploadAccountLetterError: errorMessage,
    uploadAccountLetterData: data
  };
};

export const useRevenueInfo = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.DownloadRevenueInformation()
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
    revenueInfoAsync: mutateAsync,
    revenueInfoIsLoading: isLoading,
    revenueInfoError: errorMessage,
    revenueInfoData: data
  };
};

export const useUpdateRevenueInfo = (handleSuccess) => {
  const { error, isLoading, mutateAsync, data } = useMutateItem({
    mutationFn: async (payload) => {
      const res = await httpService.postData(
        payload,
        routes.UpdateRevenueInformation()
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
    updateRevenueInfoAsync: mutateAsync,
    updateRevenueInfoIsLoading: isLoading,
    updateRevenueInfoError: errorMessage,
    updateRevenueInfoData: data
  };
};