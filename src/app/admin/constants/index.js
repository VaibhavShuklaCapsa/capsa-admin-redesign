export const OrganizationName = "Capsa";

export const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "text-[#16A34A] bg-lightGreen"
      case "Pending":
        return "text-[#EA580C] bg-lightPink"
      case "Listed":
        return "text-[#EA580C] bg-lightPink"
      case "Not Presented":
        return "text-[#6B7280] bg-[#F3F4F5]"
      case "Closed":
        return "text-[#6B7280] bg-[#F3F4F5]"
      case "Sold":
        return "text-blue bg-[#EBF6FB]"
      case "Approved":
        return "text-blue bg-[#EBF6FB]"
      case "Open":
        return "text-[#16A34A] bg-lightGreen"
      case "Rejected":
        return "text-[#B91C1C] bg-[#FFECEC]"
      case "Accepted":
        return "text-blue bg-[#EBF6FB]"
      default:
        return "text-[#6B7280] bg-[#F3F4F5]"
    }
}

export const getBgColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-[#16A34A]"
      case "Pending":
        return "bg-[#EA580C]"
      case "Not Presented":
        return "bg-[#6B7280]"
      case "Sold":
        return "bg-blue"
      case "Open":
        return "bg-[#16A34A]"
      case "Accepted":
        return "bg-blue"
      default:
        return "bg-[#6B7280]"
    }
}

export const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(/\s+/); // split by spaces

  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
}

export function formatNumberInput(value) {
  // // Remove anything that is not a number
  // const numericValue = value?.replace(/\D/g, "");

  // // Add commas to the number
  // return numericValue?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (!value) return "";

  // Remove invalid chars except decimal point
  let sanitized = value.replace(/[^0-9.]/g, "");

  // Allow only one decimal point
  const parts = sanitized.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1]?.slice(0); // keep all decimals

  // Add commas to integer part
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

export function formatNumber(value, locale = "en-US", options = {}) {
  const number = Number(value);
  if (Number.isNaN(number)) return "0";

  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);
}

export function formatCurrency(value, currencySymbol = "₦", locale = "en-US") {
  return `${currencySymbol} ${formatNumber(value, locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getRawNumber(value) {
  // return value.replace(/\D/g, "");
  return value.replace(/,/g, "");
}

export function getVat(amount, type = "string") {
  const amountValue = type === "string" ? Number(getRawNumber(amount)) : Number(amount);
  return  Math.round((7.5/100) * amountValue)
}


export const calculateNetAmount = (data) => {
    if (data?.sell_now_price) {
      const netAmount = data?.sell_now_price  + getVat(data?.invoice_amount, "number") + data?.platform_fee;
      return `${currency} ${netAmount.toLocaleString()}`;
    }
    else {
      const netAmount = data?.invoice_amount  + getVat(data?.invoice_amount, "number") + data?.platform_fee;
      return `${currency} ${netAmount.toLocaleString()}`;
    }
  }
// 
 export const handleDownload = (url, name) => {
    if (!url) return;
    
    // Determine filename - use provided name or extract from URL or default to 'document.pdf'
    const fileName = name || 
      (url.split('/').pop().split('?')[0] || 'document.pdf') || 
      'document.pdf';
    
    // Ensure filename has .pdf extension
    const pdfFileName = fileName.toLowerCase().endsWith('.pdf') ? 
      fileName : 
      fileName.replace(/\.[^/.]+$/, '') + '.pdf';
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', pdfFileName); // Set the download attribute and filename
        
        // Append link to body, click it, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the blob URL to free memory
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        toast.error('Failed to download file. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };
export function getDaysDifference(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24;

    const differenceMs = date2.getTime() - date1.getTime();

    return Math.floor(differenceMs / oneDay);
}


export const currency = "₦"