export type IconName =
  | "dashboard"
  | "requests"
  | "clients"
  | "services"
  | "portfolio"
  | "workshops"
  | "instagram"
  | "messages"
  | "settings"
  | "logout"
  | "external"
  | "menu"
  | "mark"
  | "calendar"
  | "clock"
  | "check"
  | "coins"
  | "search";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  requests: (
    <>
      <path d="M8 4h8l2 3v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7l2-3z" />
      <path d="M9 4v3h6V4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  clients: (
    <>
      <path d="M16 20v-1.2a3.2 3.2 0 0 0-3.2-3.2H7.2A3.2 3.2 0 0 0 4 18.8V20" />
      <circle cx="10" cy="8" r="3" />
      <path d="M20 20v-1.1a2.8 2.8 0 0 0-2.2-2.7" />
      <path d="M16 5.1a3 3 0 0 1 0 5.8" />
    </>
  ),
  services: (
    <>
      <path d="M12 3l1.4 4.2L18 8.5l-3.4 2.6L15.8 16 12 13.6 8.2 16l1.2-4.9L6 8.5l4.6-1.3L12 3z" />
      <path d="M18 14l.7 2 2 .6-2 .6-.7 2-.7-2-2-.6 2-.6.7-2z" />
    </>
  ),
  portfolio: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.4" />
      <path d="M21 16l-5-4-9 7" />
    </>
  ),
  workshops: (
    <>
      <path d="M4 19V6.5A1.5 1.5 0 0 1 5.5 5H12v14H5.5A1.5 1.5 0 0 1 4 17.5" />
      <path d="M12 5h6.5A1.5 1.5 0 0 1 20 6.5V19a1.5 1.5 0 0 1-1.5 1.5H12" />
      <path d="M8 9h2M14 9h2" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17" cy="7" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  messages: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.8 7.2l1.9 1.1M17.3 15.7l1.9 1.1M4.8 16.8l1.9-1.1M17.3 8.3l1.9-1.1" />
    </>
  ),
  logout: (
    <>
      <path d="M10 7V5a1 1 0 0 1 1-1h8v16h-8a1 1 0 0 1-1-1v-2" />
      <path d="M4 12h10" />
      <path d="M11 9l3 3-3 3" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h5v5" />
      <path d="M19 5l-8 8" />
      <path d="M17 13.5V19H5V7h5.5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  mark: (
    <path d="M12 3l7 9-7 9-7-9 7-9z" />
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12.2l2.3 2.3 4.7-5" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="12" cy="7" rx="7" ry="3" />
      <path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      <path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l4 4" />
    </>
  ),
};
