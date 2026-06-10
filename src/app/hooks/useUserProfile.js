'use client';
import { useEffect, useState } from 'react';
import { getFullUserProfile, getProfileFromToken } from '../admin/services/auth';

/**
 * Hook to get FULL decrypted user profile with ALL fields
 * Returns all data from the decrypted JWT encdata
 */
export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const fullProfile = await getFullUserProfile();
        
        if (fullProfile) {
          setProfile(fullProfile);
          console.log('✅ User profile loaded:', fullProfile);
        } else {
          setError('Failed to load user profile');
          console.error('❌ Failed to load user profile');
        }
      } catch (err) {
        setError(err.message);
        console.error('❌ Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profile, loading, error };
};

/**
 * Hook to get BASIC profile info synchronously (no decryption)
 * Only returns: email, panNumber, role, name
 */
export const useBasicProfile = () => {
  const basicProfile = getProfileFromToken();
  return basicProfile;
};
