import { useEffect } from 'react';
import { redirectToLogin, validateWithRefresh } from '@/utils/auth';

export function useRequireAuth() {
  useEffect(() => {
    const validate = async () => {
      const isValid = await validateWithRefresh();

      if (!isValid) {
        redirectToLogin('Сесията ви е изтекла. Моля влезте отново.');
      }
    };

    validate();
  }, []);
}