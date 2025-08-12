
export function TriviaIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      <path d="M12 7c-2.4 0-4 1.5-4 4h1.5c0-1.2 1-2.5 2.5-2.5s2.5 1.3 2.5 2.5c0 2-2.5 2-2.5 4v0h1.5c0-2 2.5-1.5 2.5-4C16 8.5 14.4 7 12 7z" />
      <path d="M21 15a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  );
}
