"use client";

import Modal from '@/admin/app/components/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/admin/app/components/ui/input';
import { Label } from '@/admin/app/components/ui/label';
import { useDownloadContract } from '@/admin/app/services/investor';
import { getProfileFromToken } from '@/admin/app/services/auth';
import HttpService from '@/admin/app/services/httpService';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import PdfViewer from '@/admin/app/components/PdfViewer';
import { useSelector } from 'react-redux';

const ContractDialog = ({ open, onOpenChange, dealId, selectedInvoice, type = "Invoices", onRefresh }) => {
  const { panNumber } = getProfileFromToken();
  const httpService = new HttpService();
  
  // Get user data from Redux (needed for API calls)
  const userName = useSelector((state) => state.user.userName);
  const userEmail = useSelector((state) => state.user.email);
  
  // State management
  const [digitalSignature, setDigitalSignature] = useState('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastErrorTime, setLastErrorTime] = useState(null);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  
  // Check if this is a Revenue contract (single-step download, no signature needed)
  const isRevenue = type === "Revenues";

  // API hook for downloading contract - separate handlers for preview and download
  const { downloadContractAsync, downloadContractIsLoading, downloadContractError, downloadContractData } = useDownloadContract((response) => {
    console.log("🔵 [CALLBACK] Download contract callback triggered");
    console.log("🔵 [CALLBACK] Response:", response);
    console.log("🔵 [CALLBACK] Status:", response?.status);
    console.log("🔵 [CALLBACK] Data URL:", response?.data?.url);
    
    // This callback is ONLY for the second API call (download with signature)
    // The preview API call is handled separately in fetchPreviewContract
    
    if (response?.status === 'success' && response?.data?.url) {
      console.log("✅ [CALLBACK] Second API call successful - proceeding to download");
      console.log("📥 [CALLBACK] Calling handleFileDownload with URL:", response.data.url);
      
      // Second API call was successful - download the file
      handleFileDownload(response.data.url);
      
      console.log("⏰ [CALLBACK] Setting timeout to close dialog after 1 second");
      // Reset state and close dialog after successful download
      setTimeout(() => {
        console.log("✅ [CALLBACK] Timeout complete - closing dialog and resetting states");
        onOpenChange(false);
        if (onRefresh) onRefresh(); // Refresh the Live Deals page
        setDigitalSignature('');
        setPreviewPdfUrl(null);
        setIsDownloading(false);
        setIsPreviewLoaded(false);
        setRetryCount(0);
        console.log("✅ [CALLBACK] All states reset");
      }, 1000);
    } else {
      console.log("❌ [CALLBACK] API call failed or unsuccessful");
      console.log("❌ [CALLBACK] Error message:", response?.message);
      // Handle error response
      const errorMessage = response?.message || 'Failed to download contract';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setIsDownloading(false);
    }
  });

  // Fetch preview PDF when dialog opens or when dependencies change
  useEffect(() => {
    console.log("🟢 [USEEFFECT] Preview useEffect triggered");
    console.log("🟢 [USEEFFECT] open:", open);
    console.log("🟢 [USEEFFECT] dealId:", dealId);
    console.log("🟢 [USEEFFECT] panNumber:", panNumber);
    console.log("🟢 [USEEFFECT] type:", type);
    
    // Reset states when dialog opens
    if (open) {
      setDigitalSignature('');
      setPreviewPdfUrl(null);
      setIsDownloading(false);
      setIsPreviewLoaded(false);
      setRetryCount(0);
    }
    
    if (open && dealId && panNumber) {
      console.log("✅ [USEEFFECT] All conditions met - fetching preview contract");
      console.log("=== FETCHING PREVIEW CONTRACT ===");
      console.log("Deal ID:", dealId);
      console.log("PAN Number:", panNumber);
      console.log("Type:", type);
      
      // First API call - Get preview PDF (without d_name)
      const fetchPreviewContract = async () => {
        console.log("📞 [PREVIEW] Starting fetchPreviewContract function");
        
        try {
          // Build payload based on type
          let payload = {};
          
          if (type === "Revenues") {
            // Revenue API requires specific payload format
            payload = {
              panNumber: panNumber,
              deal_id: dealId,
              isBuyer: "0",  // ALWAYS string "0" for investor
              userName: userName
            };
            console.log("📦 [PREVIEW] REVENUE payload created:", payload);
            console.log("⚠️ [PREVIEW] NOTE: Revenue API requires isBuyer: '0' and userName");
          } else {
            // Invoice and Asset payload
            payload = {
              panNumber: panNumber,
              deal_id: dealId
            };
            console.log("📦 [PREVIEW] Invoice/Asset payload created:", payload);
          }
          
          console.log("📨 [PREVIEW] Payload to send:", payload);
          
          // Call API directly using httpService to avoid triggering the download callback
          console.log("🔗 [PREVIEW] Calling httpService.postData...");
          
          // STEP 1: First call check_balance_buynow API
          const balanceCheckEndpoint = '/redesign/investor/check_balance_buynow';
          console.log("📡 [STEP 1] Calling balance check API:", balanceCheckEndpoint);
          
          // Build payload for balance check
          const balancePayload = {
            deal_id: dealId,
            prop_amt: selectedInvoice?.buy_now_price || selectedInvoice?.ask_amt || "0",
            panNumber: panNumber
          };
          
          console.log("📨 [STEP 1] Balance check payload:", balancePayload);
          
          try {
            // Call balance check API
            const balanceRes = await httpService.postData(balancePayload, balanceCheckEndpoint);
            const balanceResponse = balanceRes?.data;
            
            console.log("📨 [STEP 1] Balance check response:", balanceResponse);
            
            // Check if balance check was successful
            if (balanceResponse?.status !== 'success') {
              console.log("❌ [STEP 1] Balance check failed");
              const errorMsg = balanceResponse?.message || 'Balance check failed';
              toast.error(errorMsg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
              return;
            }
            
            console.log("✅ [STEP 1] Balance check successful - proceeding to load PDF");
            
            // STEP 2: Now call loadPurchaseAgreementInvestor API to get PDF URL
            const pdfEndpoint = '/redesign/investor/loadPurchaseAgreementInvestor';
            console.log("📡 [STEP 2] Loading PDF from:", pdfEndpoint);
            
            const pdfRes = await httpService.postData(balancePayload, pdfEndpoint);
            const pdfResponse = pdfRes?.data;
            
            console.log("📨 [STEP 2] PDF response:", pdfResponse);
            console.log("📨 [STEP 2] PDF data URL:", pdfResponse?.data?.url);
            
            if (pdfResponse?.status === 'success' && pdfResponse?.data?.url) {
              console.log("✅ [SUCCESS] Got PDF URL from loadPurchaseAgreementInvestor");
              
              // For Revenue contracts: Directly download
              if (isRevenue) {
                console.log("💰 REVENUE TYPE - Downloading file directly");
                await handleFileDownload(pdfResponse.data.url);
                
                setTimeout(() => {
                  console.log("✅ Download complete - closing dialog");
                  onOpenChange(false);
                }, 1000);
              } else {
                // For Invoice/Asset: Show PDF preview for signature
                console.log("📄 INVOICE/ASSET TYPE - Showing PDF preview");
                setPreviewPdfUrl(pdfResponse.data.url);
                setIsPreviewLoaded(true);
              }
              
              console.log("✅ PDF URL loaded successfully:", pdfResponse.data.url);
            } else {
              console.log("❌ [STEP 2] Failed to load PDF");
              const errorMsg = pdfResponse?.message || 'Failed to load sale agreement PDF';
              toast.error(errorMsg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              });
            }
            
          } catch (error) {
            console.error("💥 ERROR in two-step API call:", error);
            toast.error('Failed to load contract. Please try again.', {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } catch (error) {
          console.error("💥 ERROR in fetchPreviewContract:", error);
          toast.error('Failed to load contract. Please try again.', {
            position: "top-right",
            autoClose: 5000,
          });
        }
      };
      
      console.log("🚀 [USEEFFECT] Calling fetchPreviewContract()");
      fetchPreviewContract();
    } else {
      console.log("⏭️ [USEEFFECT] Skipping - conditions not met");
      console.log("⏭️ [USEEFFECT] open:", open, "dealId:", dealId, "panNumber:", panNumber);
    }
  }, [open, dealId, panNumber, type, userName]); // ← ADDED type AND userName TO DEPENDENCIES

  // Handle API errors with retry logic
  useEffect(() => {
    if (downloadContractError && !downloadContractIsLoading) {
      const currentTime = Date.now();
      const timeSinceLastError = lastErrorTime ? currentTime - lastErrorTime : Infinity;
      
      // Show error toast
      toast.error(downloadContractError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      
      setLastErrorTime(currentTime);
      setIsDownloading(false);
    }
  }, [downloadContractError, downloadContractIsLoading]);

  // Function to download file from URL
  const handleFileDownload = async (url) => {
    console.log("📥 [DOWNLOAD] handleFileDownload called");
    console.log("📥 [DOWNLOAD] URL to download:", url);
    console.log("📥 [DOWNLOAD] Type:", type);
    
    try {
      // For Revenue contracts: Use direct link method (bypasses CORS issues)
      if (isRevenue) {
        console.log("💰 [DOWNLOAD] REVENUE TYPE - Using direct link method");
        
        // Create temporary link and trigger download directly
        console.log("📎 [DOWNLOAD] Creating direct download link...");
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Purchase_Agreement_${dealId}.pdf`);
        link.target = '_blank'; // Open in new tab as fallback
        
        console.log("🖱️ [DOWNLOAD] Appending link to body and clicking...");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("✅ [DOWNLOAD] Direct download triggered!");
        
        // Show success toast
        console.log("🎉 [DOWNLOAD] Showing success toast");
        toast.success('File downloaded successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // For Invoice/Asset: Use fetch+blob method (allows signature embedding check)
        console.log("📄 [DOWNLOAD] INVOICE/ASSET TYPE - Using fetch+blob method");
        
        console.log("🔗 [DOWNLOAD] Fetching file from URL...");
        const response = await fetch(url);
        console.log("📨 [DOWNLOAD] File response received:", response);
        console.log("📨 [DOWNLOAD] Response status:", response.status);
        console.log("📨 [DOWNLOAD] Response headers:", response.headers);
        
        console.log("💾 [DOWNLOAD] Converting response to blob...");
        const blob = await response.blob();
        console.log("💾 [DOWNLOAD] Blob created:", blob);
        console.log("💾 [DOWNLOAD] Blob type:", blob.type);
        console.log("💾 [DOWNLOAD] Blob size:", blob.size, "bytes");
        
        // Create object URL
        console.log("🔗 [DOWNLOAD] Creating object URL...");
        const blobUrl = window.URL.createObjectURL(blob);
        console.log("🔗 [DOWNLOAD] Object URL created:", blobUrl);
        
        // Create temporary link and trigger download
        console.log("📎 [DOWNLOAD] Creating temporary download link...");
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', `Sale_Agreement_${dealId}.pdf`);
        console.log("📎 [DOWNLOAD] Link href:", link.href);
        console.log("📎 [DOWNLOAD] Download attribute:", link.getAttribute('download'));
        
        console.log("🖱️ [DOWNLOAD] Appending link to body and clicking...");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log("✅ [DOWNLOAD] File download triggered!");
        
        // Clean up
        console.log("🧹 [DOWNLOAD] Revoking object URL...");
        window.URL.revokeObjectURL(blobUrl);
        console.log("✅ [DOWNLOAD] Object URL revoked");
        
        console.log("✅ [DOWNLOAD] File downloaded successfully");
        
        // Show success toast
        console.log("🎉 [DOWNLOAD] Showing success toast");
        toast.success('Contract downloaded successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("💥 [DOWNLOAD] ERROR downloading file:", error);
      console.error("💥 [DOWNLOAD] Error stack:", error.stack);
      toast.error('Failed to download contract', {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Handle download button click
  const handleDownloadClick = async () => {
    console.log("🖱️ [CLICK] Download button clicked");
    console.log("📝 [CLICK] Digital signature value:", digitalSignature);
    console.log("📝 [CLICK] Digital signature trimmed:", digitalSignature?.trim());
    console.log("❓ [CLICK] Is signature empty?:", !digitalSignature || digitalSignature.trim() === '');
    
    if (!digitalSignature || digitalSignature.trim() === '') {
      console.log("❌ [CLICK] Signature is empty - showing error");
      toast.error('Please enter your digital signature name', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    console.log("✅ [CLICK] Signature is valid - proceeding with Buy Now action");
    setIsDownloading(true);
    console.log("✅ [CLICK] isDownloading state set to: true");
    
    console.log("=== INVOICE BUY NOW ACTION API CALL ===");
    console.log("Digital Signature:", digitalSignature);
    console.log("Type:", type);
    
    try {
      // Build payload for invoiceBuyNowAction
      const payload = {
        deal_id: dealId,
        prop_amt: selectedInvoice?.buy_now_price || selectedInvoice?.ask_amt || "0",
        panNumber: panNumber,
        digital_name: digitalSignature.trim().toUpperCase(), // Auto uppercase for signature
        userName: userName,
        email: userEmail || ""
      };
      
      console.log("📦 [CLICK] Invoice Buy Now payload created:", payload);
      
      // API endpoint for invoice buy now action
      const apiEndpoint = '/redesign/investor/invoiceBuyNowAction';
      console.log("📡 [CLICK] Using Invoice Buy Now API endpoint:", apiEndpoint);
      
      console.log("🔗 [CLICK] Calling httpService.postData for invoice buy now...");
      const res = await httpService.postData(payload, apiEndpoint);
      const response = res?.data;
      
      console.log("📨 [CLICK] Invoice Buy Now API response:", response);
      
      if (response?.status === 'success') {
        console.log("✅ [CLICK] Invoice Buy Now successful!");
        
        // Show success message
        // toast.success('Invoice purchased successfully!', {
        //   position: "top-right",
        //   autoClose: 3000,
        // });
        
        // Reset state and close dialog after successful purchase
        setTimeout(() => {
          console.log("✅ [CLICK] Timeout complete - closing dialog and resetting states");
          onOpenChange(false);
          if (onRefresh) onRefresh(); // Refresh the Live Deals page
          setDigitalSignature('');
          setPreviewPdfUrl(null);
          setIsDownloading(false);
          setIsPreviewLoaded(false);
          setRetryCount(0);
          console.log("✅ [CLICK] All states reset");
        }, 1000);
      } else {
        console.log("❌ [CLICK] Invoice Buy Now API returned unsuccessful response");
        const errorMessage = response?.message || 'Failed to process invoice purchase';
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setIsDownloading(false);
      }
      
      console.log("✅ [CLICK] Invoice Buy Now process completed");
    } catch (error) {
      console.error("💥 [CLICK] ERROR in invoice buy now API call:", error);
      console.error("💥 [CLICK] Error stack:", error.stack);
      toast.error('Failed to process invoice purchase. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
      setIsDownloading(false);
      console.log("❌ [CLICK] isDownloading state reset to: false");
    }
  };

  // Handle retry with cooldown
  const handleRetry = () => {
    const currentTime = Date.now();
    const timeSinceLastError = lastErrorTime ? currentTime - lastErrorTime : Infinity;
    
    // 3 second cooldown between retries
    if (timeSinceLastError < 3000) {
      toast.info('Please wait 3 seconds before retrying', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    setRetryCount(retryCount + 1);
    handleDownloadClick();
  };
return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isRevenue ? "Purchase Agreement - Revenue" : "Sales Agreement"}
      description="Append your digital signature to the sales agreement to confirm purchase of the invoice"
      contentClassName="border-none shadow-none max-h-9/10 backdrop-blur-none overflow-auto"
      cancel={false}
      confirm={false}
      content={
        <div className="overflow-auto">
          <div className="flex flex-col gap-4 overflow-auto">
            {/* PDF Preview Section */}
            {previewPdfUrl ? (
              <div className="border rounded-md bg-sky-50 w-full">
                <PdfViewer url={previewPdfUrl} />
              </div>
            ) : (
              <div className="border rounded-md bg-sky-50 p-6 h-120 w-full flex items-center justify-center">
                <div className="text-center">
                  <Image src="/images/loader.gif" width={80} height={80} alt="Loading PDF..." />
                  <p className="text-grey mt-4">Loading purchase agreement...</p>
                </div>
              </div>
            )}

            {/* Digital Signature Input - HIDDEN for Revenue */}
            {!isRevenue && (
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Digital Signature</Label>
                  <Input
                    value={digitalSignature}
                    onChange={(e) => setDigitalSignature(e.target.value.toUpperCase())}
                    className="mt-2"
                    placeholder="Enter Name Here"
                    disabled={isDownloading}
                  />

                  <p className="font-normal text-sm text-grey mt-2">
                    By entering your name above, you agree to the terms and
                    conditions of this sales agreement.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      onOpenChange(false);
                      if (onRefresh) onRefresh();
                      setDigitalSignature('');
                      setPreviewPdfUrl(null);
                      setIsDownloading(false);
                      setIsPreviewLoaded(false);
                      setRetryCount(0);
                    }}
                    disabled={isDownloading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={"bg-blue"}
                    onClick={handleDownloadClick}
                    disabled={isDownloading || (!digitalSignature && !isRevenue)}
                    style={{ 
                      opacity: (isDownloading || (!digitalSignature && !isRevenue)) ? 0.6 : 1, 
                      cursor: (isDownloading || (!digitalSignature && !isRevenue)) ? 'not-allowed' : 'pointer' 
                    }}
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      isRevenue ? 'Download' : 'Accept'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* For Revenue type, show buttons without signature */}
            {isRevenue && (
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="ghost"
                  onClick={() => {
                    onOpenChange(false);
                    if (onRefresh) onRefresh();
                    setDigitalSignature('');
                    setPreviewPdfUrl(null);
                    setIsDownloading(false);
                    setIsPreviewLoaded(false);
                    setRetryCount(0);
                  }}
                  disabled={isDownloading}
                >
                  Cancel
                </Button>
                <Button
                  className={"bg-blue"}
                  onClick={handleDownloadClick}
                  disabled={isDownloading}
                  style={{ 
                    opacity: isDownloading ? 0.6 : 1, 
                    cursor: isDownloading ? 'not-allowed' : 'pointer' 
                  }}
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Download'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default ContractDialog;
