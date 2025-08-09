'use client';
export const dynamic = 'force-dynamic';

import SignupStep2 from '@/components/auth/step2';
import { Suspense } from 'react';


export default function SignupStep2Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupStep2 />
    </Suspense>
  );
}
