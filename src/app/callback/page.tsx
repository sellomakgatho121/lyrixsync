'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/spotify';

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      getAccessToken(code)
        .then((data) => {
          localStorage.setItem('spotify_access_token', data.access_token);
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
          router.push('/');
        })
        .catch((error) => {
          console.error('Error getting access token:', error);
          router.push('/');
        });
    }
  }, [searchParams, router]);

  return <div>Loading...</div>;
}
