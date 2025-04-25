'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn } from '@/lib/auth';

export default function MainRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.replace('/home');
    } else {
      router.replace('/sign-up');
    }
  }, []);

  return <div>Redirecting...</div>;
}
