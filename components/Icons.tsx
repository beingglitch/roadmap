type P = { size?: number; className?: string };

const svg = (size: number, className: string | undefined, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const Chevron = ({ size = 14, className }: P) => svg(size, className, <path d="m9 6 6 6-6 6" />);
export const ChevronLeft = ({ size = 16, className }: P) => svg(size, className, <path d="m15 6-6 6 6 6" />);
export const ChevronDown = ({ size = 14, className }: P) => svg(size, className, <path d="m6 9 6 6 6-6" />);
export const Home = ({ size = 16, className }: P) =>
  svg(size, className, <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>);
export const Play = ({ size = 16, className }: P) => svg(size, className, <path d="M7 4.5v15l12-7.5z" fill="currentColor" />);
export const Video = ({ size = 16, className }: P) =>
  svg(size, className, <><rect x="2.5" y="5" width="14" height="14" rx="2" /><path d="m16.5 10 5-3v10l-5-3" /></>);
export const Book = ({ size = 16, className }: P) =>
  svg(size, className, <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></>);
export const Diagram = ({ size = 16, className }: P) =>
  svg(size, className, <><rect x="3" y="3" width="7" height="6" rx="1.5" /><rect x="14" y="15" width="7" height="6" rx="1.5" /><path d="M6.5 9v4a2 2 0 0 0 2 2H14" /></>);
export const Ext = ({ size = 14, className }: P) =>
  svg(size, className, <><path d="M14 4h6v6" /><path d="M20 4 10 14" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>);
export const Check = ({ size = 16, className }: P) => svg(size, className, <path d="m5 12.5 4.5 4.5L19 7.5" />);
export const Sun = ({ size = 16, className }: P) =>
  svg(size, className, <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const Moon = ({ size = 16, className }: P) => svg(size, className, <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />);
export const Menu = ({ size = 18, className }: P) => svg(size, className, <path d="M4 7h16M4 12h16M4 17h16" />);
export const Note = ({ size = 16, className }: P) =>
  svg(size, className, <><path d="M5 3h10l4 4v14H5z" /><path d="M9 12h6M9 16h6" /></>);
export const Link2 = ({ size = 16, className }: P) =>
  svg(size, className, <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>);
export const Arrow = ({ size = 16, className }: P) => svg(size, className, <path d="M5 12h14M13 6l6 6-6 6" />);

export const Mark = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="brand-mark">
    <path d="M4 18 L10 12 L14 15 L20 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="18" r="2.2" fill="currentColor" />
    <circle cx="10" cy="12" r="2.2" fill="currentColor" />
    <circle cx="14" cy="15" r="2.2" fill="currentColor" />
    <circle cx="20" cy="6" r="2.6" fill="var(--accent)" />
  </svg>
);
