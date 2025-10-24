'use client';
import { useAuth } from '@/hooks/use-auth';
import ProfileClient from './ProfileClient';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return <ProfileClient user={user} />;
}
