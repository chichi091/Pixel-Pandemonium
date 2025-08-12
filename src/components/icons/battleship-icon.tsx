
export function BattleshipIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M2 20.5l.5-3.5 2-2 4-1 2-2 1-3.5 2-1 1 3 3 .5 2 2.5 1 2V21" />
      <path d="M19 21h-2" />
      <path d="M12 10.5V21" />
      <path d="M9 13l-2 8" />
      <path d="M15 13l2 8" />
      <path d="M6.5 7.5L8 3" />
      <path d="M16 3l-1.5 4.5" />
    </svg>
  );
}
