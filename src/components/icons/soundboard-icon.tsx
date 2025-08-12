
export function SoundboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="M12 12h4" />
      <path d="M12 16h4" />
      <path d="M8 12h.01" />
      <path d="M8 16h.01" />
      <path d="m16 8-4 4" />
    </svg>
  );
}
