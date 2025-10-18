// src/lib/utils/error-handler.ts
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

export function handleApiError(error: unknown, customMessage?: string) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message || error.message;
    toast({
      variant: 'destructive',
      title: 'Error',
      description: customMessage || message,
    });
  } else {
    toast({
      variant: 'destructive',
      title: 'Unexpected Error',
      description: customMessage || 'Something went wrong. Please try again later.',
    });
  }
  console.error('API Error:', error);
}
