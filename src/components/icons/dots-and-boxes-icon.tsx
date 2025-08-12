
export function DotsAndBoxesIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="7" y1="7" x2="7" y2="7.01" />
      <line x1="7" y1="12" x2="7" y2="12.01" />
      <line x1="7" y1="17" x2="7" y2="17.01" />
      <line x1="12" y1="7" x2="12" y2="7.01" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
      <line x1="17" y1="7" x2="17" y2="7.01" />
      <line x1="17" y1="12" x2="17" y2="12.01" />
      <line x1="17" y1="17" x2="17" y2="17.01" />
      <line x1="7" y1="7" x2="12" y2="7" />
      <line x1="7" y1="12" x2="7" y2="17" />
    </svg>
  );
}
