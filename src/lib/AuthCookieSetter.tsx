'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export default function AuthCookieSetter() {
    const router = useRouter();
    useEffect(() => {
        const contextInfo = localStorage.getItem('contextInfo');
        const contextJWT = localStorage.getItem('contextJWT');

        if (contextInfo && contextJWT) {
          const encodedContextInfo = encodeURIComponent(contextInfo);
          setCookie('contextInfo', encodedContextInfo, 7);
          setCookie('contextJWT', contextJWT, 7);
          // Once cookies are set, refresh the page using the Next.js router.
          router.refresh();
        } else {
          // If no auth info in localStorage, user needs to log in.
          // You might want to redirect to a login page here.
          console.error("Authentication details not found in localStorage.");
        }
    }, [router])

    return <div>Please wait, preparing your session...</div>
}
