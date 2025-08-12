export function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Base */}
            <path d="M9 19H15V20H9V19Z" fill="#B8860B" />
            <path d="M8 18H16V19H8V18Z" fill="#D4AF37" />

            {/* Stem */}
            <path d="M11 15H13V18H11V15Z" fill="#FFD700" />
            <path d="M12 15H13V18H12V15Z" fill="#F9A825" />

            {/* Cup */}
            <path d="M8 9H16V15H8V9Z" fill="#FFD700" />
            <path d="M9 10H15V11H9V10Z" fill="#F9A825" />
            <path d="M8 9H9V15H8V9Z" fill="#F9A825" />

            {/* Handles */}
            <path d="M6 10H8V13H6V10Z" fill="#FFD700" />
            <path d="M16 10H18V13H16V10Z" fill="#FFD700" />
            <path d="M7 10H8V11H7V10Z" fill="#F9A825" />
            <path d="M16 10H17V11H16V10Z" fill="#F9A825" />

            {/* Rim */}
            <path d="M7 7H17V9H7V7Z" fill="#B8860B" />
            <path d="M7 8H17V9H7V8Z" fill="#FFD700" />
            
             {/* Sparkle Animation */}
            <rect x="10" y="12" width="1" height="1" fill="#FFFACD" opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.9;0;0.9"
                dur="1.5s"
                repeatCount="indefinite"
                begin="0.5s"
              />
            </rect>
        </svg>
    )
}
