import { Href, router } from 'expo-router';
import { useEffect } from 'react';
import { redirectToLogin, validateWithRefresh } from '@/utils/auth';

export function useAuthGuard(redirectOnSuccess: Href = '/(tabs)/main') {
  useEffect(() => {
    const validate = async () => {
      const isValid = await validateWithRefresh();

      if (isValid) {
        router.replace(redirectOnSuccess);
      } else {
        redirectToLogin('Моля влезте в профила си.');
      }
    };

    validate();
  }, []);
}