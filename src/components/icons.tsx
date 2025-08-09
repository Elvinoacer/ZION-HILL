// components/icons.tsx
import * as React from "react";

export const Icons = {
  pen: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  ),
  dollar: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  newspaper: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  ),
  dashboard: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  family: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M8 7v6" />
      <path d="M16 7v6" />
      <path d="M12 7v6" />
      <path d="M12 17v4" />
      <path d="M19 17h2l.7-2.6c.1-.3.1-.6 0-.9l-.6-2.5c-.2-.8-.5-1.4-1-1.8s-1.1-.6-1.8-.6H16c-.7 0-1.3.2-1.8.6-.5.4-.8 1-1 1.8l-.6 2.5c0 .3 0 .6.1.9L14 17h2" />
      <path d="M8 17H6l-.7-2.6c-.1-.3-.1-.6 0-.9l.6-2.5c.2-.8.5-1.4 1-1.8s1.1-.6 1.8-.6H8c.7 0 1.3.2 1.8.6.5.4.8 1 1 1.8l.6 2.5c0 .3 0 .6.1.9L10 17H8" />
    </svg>
  ),
  church: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2" />
      <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" />
      <path d="M18 22V5l-6-3-6 3v17" />
      <path d="M12 7v5" />
      <path d="M10 9h4" />
    </svg>
  ),
  resource: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  ),
  bible: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M3 19.5A2.5 2.5 0 0 1 5.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 7h-1v4" />
      <path d="M9.5 7h1" />
      <path d="M14 7h-1v4" />
      <path d="M11.5 7h1" />
    </svg>
  ),
  star: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  prayHands: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M7 11v4.7c0 .5.2.9.5 1.2.3.3.8.5 1.3.5h.2c1.2 0 2.3-.7 3.1-1.8l1.4-2.1c.2-.3.5-.5.9-.5h2.1c.8 0 1.5-.7 1.5-1.5v-1.3c0-.8-.7-1.5-1.5-1.5h-1.4c-.4 0-.7-.2-.9-.5l-1.4-2.1c-.8-1.1-1.9-1.8-3.1-1.8h-.2c-.5 0-1 .2-1.3.5-.3.3-.5.7-.5 1.2V11z" />
      <path d="M7 11v4.7c0 .5.2.9.5 1.2.3.3.8.5 1.3.5h.2c1.2 0 2.3-.7 3.1-1.8l1.4-2.1c.2-.3.5-.5.9-.5h2.1c.8 0 1.5-.7 1.5-1.5v-1.3c0-.8-.7-1.5-1.5-1.5h-1.4c-.4 0-.7-.2-.9-.5l-1.4-2.1c-.8-1.1-1.9-1.8-3.1-1.8h-.2c-.5 0-1 .2-1.3.5-.3.3-.5.7-.5 1.2V11z" />
      <path d="M12 10v1" />
    </svg>
  ),
  message: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  video: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
    </svg>
  ),
  bibleOpen: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  child: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  ),
  familyTree: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M18 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M6 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      <path d="M12 14v4" />
      <path d="M12 10v2" />
      <path d="m8 14 2-2" />
      <path d="m16 14-2-2" />
    </svg>
  ),
  admin: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      <path d="M12 14v2" />
      <path d="M12 10v2" />
    </svg>
  ),
  handshake: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 1 1 1.72l-.53 5.24a1 1 0 0 0 .3.7l.7.7a1 1 0 0 0 1.41 0l1.41-1.41a1 1 0 0 0 0-1.41l-.7-.7a1 1 0 0 1 .3-1.7l4.24-1.76a1 1 0 0 1 1.22.48l1.56 2.6a1 1 0 0 1-.48 1.34l-1.06.53a1 1 0 0 0-.5.84v.38a1 1 0 0 1-1 1H18a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1" />
      <path d="m13 7-2-2a1 1 0 1 0-3 3" />
      <path d="m10 10-2.5-2.5a1 1 0 1 0-3 3l3.88 3.88a3 3 0 0 0 4.24 0l.88-.88a1 1 0 1 1 3 3l-2.81 2.81a5.79 5.79 0 0 1-7.06.87l-.47-.28a2 2 0 0 1-1-1.72l.53-5.24a1 1 0 0 0-.3-.7l-.7-.7a1 1 0 0 0-1.41 0L1.7 8.3a1 1 0 0 0 0 1.41l.7.7a1 1 0 0 1-.3 1.7L.76 13.76a1 1 0 0 1-.48-1.34L1.84 9.8a1 1 0 0 1 1.34-.48l1.06.53a1 1 0 0 0 .5.84v.38a1 1 0 0 1-1 1H3a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1" />
    </svg>
  ),
  counseling: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M17 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2" />
      <path d="M12 10v2" />
      <path d="M12 6v2" />
      <circle cx="12" cy="4" r="2" />
      <path d="M19 13a7 7 0 1 0-14 0" />
      <path d="M12 18v3" />
      <path d="M10 21h4" />
    </svg>
  ),
  music: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <circle cx="8" cy="18" r="4" />
      <circle cx="18" cy="16" r="4" />
      <path d="M12 8v8" />
      <path d="M8 18V2l10 4v12" />
    </svg>
  ),
  organization: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="M18 17v-6" />
      <path d="M13 17v-4" />
      <path d="M8 17v-2" />
    </svg>
  ),
  media: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <circle cx="8" cy="10" r="2" />
      <path d="M14 10h4" />
      <path d="M14 14h4" />
      <path d="M8 14h.01" />
    </svg>
  ),
  finance: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  megaphone: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="m3 11 18-5v12l-18-5v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  close: (props) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  spinner: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  warning: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  user: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  userCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  ),
  mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  calendarOff: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.18 4.18A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18" />
      <path d="M21 15.5V6a2 2 0 0 0-2-2H9.5" />
      <path d="M16 2v4" />
      <path d="M3 10h7" />
      <path d="M21 10h-5.5" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ),
  audioLines: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
    </svg>
  ),
  audioLinesOff: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 10v3" />
      <path d="M6 6v11" />
      <path d="M10 3v18" />
      <path d="M14 8v7" />
      <path d="M18 5v13" />
      <path d="M22 10v3" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  ),
  playCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  ),
  handCoins: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 15h1a2 2 0 1 0 0-4h-1V9h1a2 2 0 1 0 0-4h-1" />
      <path d="M8 9v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2z" />
      <circle cx="8" cy="15" r="2" />
      <path d="M16 9v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2z" />
      <circle cx="16" cy="15" r="2" />
    </svg>
  ),
  piggyBank: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h0" />
    </svg>
  ),
  bookOpen: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  bookOpenCheck: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4z" />
      <path d="M16 12l2 2 4-4" />
      <path d="M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3" />
    </svg>
  ),
  pray: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="5" r="1" />
      <path d="m9 20 3-6 3 6" />
      <path d="m6 8 6 2 6-2" />
      <path d="M12 10v4" />
    </svg>
  ),
  alertTriangle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  ),
  home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  building: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="7" y="7" width="3" height="3" />
      <rect x="14" y="7" width="3" height="3" />
      <rect x="7" y="14" width="3" height="3" />
      <rect x="14" y="14" width="3" height="3" />
    </svg>
  ),
  cross: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 2v20M2 12h20" />
    </svg>
  ),
  // Add all other required icons following the same pattern
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
};
