"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isSubAdmin } from '@/admin/app/utils/subAdminUtils';

/**
 * SubAdminRedirect Component
 * 
 * Redirects sub-admins to their dedicated My Invoices page
 * Prevents access to super-admin only pages
 */
const SubAdminRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const subAdminStatus = await isSubAdmin();
        
        if (subAdminStatus) {
          // User is sub-admin
          
          // List of paths sub-admins should NOT access
          const restrictedPaths = [
            '/dashboard',
            '/payments',
            '/vendors'
          ];

          // Check if current path is restricted
          const isRestricted = restrictedPaths.some(path => pathname.startsWith(path));
          
          if (isRestricted || pathname === '/') {
            console.log('🔄 Redirecting sub-admin to /subAdmin/myInvoices');
            router.push('/subAdmin/myInvoices');
          }
        }
      } catch (error) {
        console.error('❌ Error in sub-admin redirect:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkAndRedirect();
  }, [pathname, router]);

  // Don't render anything, just handle redirect logic
  return null;
};

export default SubAdminRedirect;
