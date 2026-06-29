import { toast } from "react-toastify";
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from "lucide-react";

export const ErrorToast = ({ message }) => (
  <div className="flex items-start gap-3 p-4 w-full">
    <div className="flex-shrink-0">
      <AlertCircle className="w-5 h-5 text-red-500" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-red-800">Error</h3>
      <p className="text-sm text-red-700 mt-1">{message}</p>
    </div>
  </div>
);

export const SuccessToast = ({ message }) => (
  <div className="flex items-start gap-3 p-4">
    <div className="flex-shrink-0">
      <CheckCircle className="w-5 h-5 text-green-500" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-green-800">Success</h3>
      <p className="text-sm text-green-700 mt-1">{message}</p>
    </div>
  </div>
);

export const InfoToast = ({ message }) => (
  <div className="flex items-start gap-3 p-4">
    <div className="flex-shrink-0">
      <InfoIcon className="w-5 h-5 text-blue-500" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-blue-800">Info</h3>
      <p className="text-sm text-blue-700 mt-1">{message}</p>
    </div>
  </div>
);

export const WarningToast = ({ message }) => (
  <div className="flex items-start gap-3 p-4">
    <div className="flex-shrink-0">
      <AlertTriangle className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-yellow-800">Warning</h3>
      <p className="text-sm text-yellow-700 mt-1">{message}</p>
    </div>
  </div>
);
