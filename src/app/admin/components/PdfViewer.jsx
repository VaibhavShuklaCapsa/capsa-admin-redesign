"use client";

import React, { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import HttpService from '@/admin/app/services/httpService';

// Polyfill for Image constructor to prevent "Failed to construct 'Image'" error
if (typeof window !== 'undefined') {
  const OriginalImage = window.Image;
  window.Image = function(...args) {
    if (!(this instanceof window.Image)) {
      return new OriginalImage(...args);
    }
    return OriginalImage.call(this, ...args);
  };
  window.Image.prototype = OriginalImage.prototype;
}

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfViewer = ({ url }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState([]);
  const [useIframe, setUseIframe] = useState(false); // Fallback for CORS issues
  const renderTasks = useRef([]);

  useEffect(() => {
    if (!url || typeof url !== 'string') {
      console.error("📄 [PDFJS] Invalid URL provided:", url);
      setError("Invalid PDF URL");
      setLoading(false);
      return;
    }
    
    console.log("📄 [PDFJS] Loading PDF from URL:", url.substring(0, 50) + "...");
    
    const loadPDF = async () => {
      try {
        setLoading(true);
        console.log("📄 [PDFJS] Processing PDF...");
        
        let arrayBuffer;
        
        // Check if it's a base64 data URL
        if (url && url.startsWith('data:')) {
          console.log("📄 [PDFJS] Detected base64 data URL");
          // Convert base64 data URL to ArrayBuffer directly
          const base64Data = url.split(',')[1]; // Remove the "data:application/pdf;base64," prefix
          const binaryString = atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          arrayBuffer = bytes.buffer;
          console.log("💾 [PDFJS] Base64 converted to ArrayBuffer, size:", arrayBuffer.byteLength, "bytes");
        } else {
          // Regular URL - fetch with authentication headers to avoid CORS issues
          console.log("📄 [PDFJS] Fetching URL with auth headers...");
          
          const httpService = new HttpService();
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          
          // const response = await fetch(url, {
          //   method: 'GET',
          //   headers: {
          //     'Authorization': token ? `Bearer ${token}` : '',
          //     'Content-Type': 'application/pdf',
          //   },
          //   mode: 'cors',
          //   credentials: 'include'
          // });
const response = await fetch(url);
          
          console.log("📨 [PDFJS] Response received:", response.status);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          arrayBuffer = await response.arrayBuffer();
          console.log("💾 [PDFJS] ArrayBuffer created, size:", arrayBuffer.byteLength, "bytes");
        }
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        
        console.log("✅ [PDFJS] PDF loaded successfully");
        console.log("📊 [PDFJS] Number of pages:", pdf.numPages);
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (err) {
        console.error("💥 [PDFJS] Error loading PDF:", err);
        
        // If CORS error, fallback to iframe
        if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
          console.log("🔄 [PDFJS] CORS detected, switching to iframe fallback");
          setUseIframe(true);
          setLoading(false);
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (url) {
      loadPDF();
    }
  }, [url]);

  // Render all pages when PDF is loaded
  useEffect(() => {
    if (pdfDoc) {
      renderAllPages();
    }
    
    // Cleanup function
    return () => {
      // Cancel all ongoing render tasks
      renderTasks.current.forEach(task => {
        if (task && task.cancel) {
          task.cancel();
        }
      });
      renderTasks.current = [];
    };
  }, [pdfDoc]);

  const renderAllPages = async () => {
    console.log("🎨 [PDFJS] Rendering all pages...");
    const pages = [];
    
    try {
      for (let i = 1; i <= numPages; i++) {
        console.log("🎨 [PDFJS] Rendering page:", i);
        
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Scale to fit container width
        const containerWidth = 520; // Reduced from 600 to account for padding
        const scaleFactor = containerWidth / viewport.width;
        
        const scaledViewport = page.getViewport({ scale: scaleFactor });
        
        pages.push({
          pageNum: i,
          width: scaledViewport.width,
          height: scaledViewport.height
        });
      }
      
      setPageData(pages);
      console.log("✅ [PDFJS] All pages data prepared");
    } catch (err) {
      console.error(" [PDFJS] Error preparing pages:", err);
    }
  };

  // Render canvases after pageData is set
  useEffect(() => {
    let cancelled = false;
    
    const renderPages = async () => {
      if (pdfDoc && pageData.length > 0) {
        // Cancel previous render tasks
        renderTasks.current.forEach(task => {
          if (task && task.cancel) {
            task.cancel();
          }
        });
        renderTasks.current = [];
        
        for (const data of pageData) {
          if (cancelled) break;
          
          const canvas = document.getElementById(`pdf-canvas-page-${data.pageNum}`);
          if (canvas) {
            const ctx = canvas.getContext('2d');
            const page = await pdfDoc.getPage(data.pageNum);
            const viewport = page.getViewport({ scale: 1.0 });
            const containerWidth = 520;
            const scaleFactor = containerWidth / viewport.width;
            const finalViewport = page.getViewport({ scale: scaleFactor });
            
            const renderContext = {
              canvasContext: ctx,
              viewport: finalViewport
            };
            
            const renderTask = page.render(renderContext);
            renderTasks.current.push(renderTask);
            
            try {
              await renderTask.promise;
            } catch (err) {
              if (err.name !== 'RenderingCancelledException') {
                console.error(" [PDFJS] Error rendering page:", err);
              }
            }
          }
        }
      }
    };
    
    renderPages();
    
    return () => {
      cancelled = true;
      renderTasks.current.forEach(task => {
        if (task && task.cancel) {
          task.cancel();
        }
      });
      renderTasks.current = [];
    };
  }, [pageData, pdfDoc]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[380px] bg-gray-50">
        <div className="text-center">
          <img src="/images/loader.gif" alt="Loading..." className="w-16 h-16 mx-auto mb-4" />
          <p className="text-grey">Loading PDF...</p>
        </div>
      </div>
    );
  }

  // Fallback: Use iframe for CORS issues
  if (useIframe || error) {
    return (
      <div className="bg-white h-full w-full">
        <div className="w-full" style={{ height: '500px' }}>
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="PDF Viewer"
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full w-full">
      {/* PDF Container with Scroll */}
      <div className="overflow-auto max-h-[500px] w-full flex flex-col items-center bg-white p-2" style={{ maxWidth: '100%' }}>
        {pageData.map((data) => (
          <div key={data.pageNum} className="relative mb-2 w-full flex justify-center">
            <canvas
              id={`pdf-canvas-page-${data.pageNum}`}
              className="shadow-lg bg-white"
              width={data.width}
              height={data.height}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            {/* Page number indicator */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded">
              Page {data.pageNum} of {numPages}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfViewer;
