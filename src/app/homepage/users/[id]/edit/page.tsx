import EditUserClient from './EditUserClient';
import { Suspense } from 'react';

export default function EditUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditUserClient />
    </Suspense>
  );
}