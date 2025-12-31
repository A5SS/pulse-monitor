'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [router, pathname]);

  return <>{children}</>;
}
