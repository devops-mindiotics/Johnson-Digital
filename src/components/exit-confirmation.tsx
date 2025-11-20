'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ExitConfirmation() {
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs only once when the layout is mounted,
    // establishing a boundary in the history stack.
    history.pushState({ boundary: true }, '', pathname);

    const handlePopState = (event: PopStateEvent) => {
      // Check if the state being popped is our boundary marker.
      if (event.state?.boundary) {
        const confirmed = window.confirm('Do you want to exit?');
        if (confirmed) {
          // If the user confirms, we can\'t reliably close the window.
          // Instead, we navigate to a blank page, which effectively
          // "closes" the app from the user\'s perspective, especially in a webview.
          window.location.replace('about:blank');
        } else {
          // If the user cancels, we push the boundary state back onto the history stack.
          // This prevents the back navigation and keeps the user in the app.
          history.pushState({ boundary: true }, '', pathname);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // The empty dependency array is crucial. It ensures this effect runs only
    // once on mount and the cleanup runs only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
