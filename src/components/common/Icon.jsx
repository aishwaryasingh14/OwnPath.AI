// Minimal inline SVG icons — no emoji, no dependency
const icons = {
  fork:     <><path d="M5 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 5a5 5 0 0 0 5 5h4a2 2 0 1 0 0-4h-4a2 2 0 0 1-2-2v-.17A4 4 0 0 0 5 3z" fill="currentColor"/></>,
  bus:      <><rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M3 11h18M8 19v2M16 19v2M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></>,
  home:     <><path d="M3 12L12 4l9 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-4h4v4h4a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></>,
  child:    <><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M12 9v5m-3 3 3-3 3 3m-6-6H6m12 0h-3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></>,
  alert:    <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="1.8" fill="none"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="17" r="1" fill="currentColor"/></>,
  check:    <><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
  phone:    <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.63 13.5 19.79 19.79 0 0 1 1.56 5c0-1.09.87-2 1.99-2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.5a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
  mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.8" fill="none"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.8"/></>,
  users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/></>,
  trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
  chart:    <><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></>,
  shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
  info:     <><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  star:     <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.8" fill="none"/></>,
  x:        <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  arrow:    <><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><polyline points="12 5 19 12 12 19" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></>,
};

export default function Icon({ name, size = 16, color = "currentColor", style = {} }) {
  const paths = icons[name];
  if (!paths) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, color, ...style }}
    >
      {paths}
    </svg>
  );
}
