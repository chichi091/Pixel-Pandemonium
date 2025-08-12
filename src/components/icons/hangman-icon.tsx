
export function HangmanIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="6" y1="20" x2="6" y2="4" />
      <line x1="6" y1="4" x2="14" y2="4" />
      <line x1="14" y1="4" x2="14" y2="8" />
      <circle cx="14" cy="11" r="3" />
      <line x1="14" y1="14" x2="14" y2="18" />
      <line x1="14" y1="15" x2="12" y2="17" />
      <line x1="14" y1="15" x2="16" y2="17" />
    </svg>
  );
}
