'use client';

import { Suspense } from 'react';
import UserClient from './client';

export default function ViewUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserClient />
    </Suspense>
  );
}
