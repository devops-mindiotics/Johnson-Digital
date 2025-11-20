'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, ...args: any[]) => Promise<any>;
    };
  }
}

export function ExitConfirmation() {
  const pathname = usePathname();

  useEffect(() => {
    history.pushState({ boundary: true }, '', pathname);

    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.boundary) {
        const confirmed = window.confirm('Do you want to exit?');
        if (confirmed) {
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('minimize_app');
          } else {
            window.location.replace('about:blank');
          }
        } else {
          history.pushState({ boundary: true }, '', pathname);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
