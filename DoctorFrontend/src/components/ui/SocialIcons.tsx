import Link from "next/link";

interface SocialLinks {
  facebook?: string;
  youtube?: string;
  zalo?: string;
  tiktok?: string;
}

interface SocialIconsProps {
  links: SocialLinks;
  size?: "sm" | "md";
  theme?: "light" | "dark";
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden>
      <path d="M12.007 0C5.372 0 0 5.373 0 12.009c0 2.56.806 4.94 2.183 6.885L.755 23.054l4.313-1.382A11.95 11.95 0 0 0 12.007 24C18.641 24 24 18.629 24 11.991 24 5.373 18.641 0 12.007 0zm5.863 16.527c-.24.673-1.398 1.286-1.927 1.366-.488.073-1.107.103-1.786-.112a16.42 16.42 0 0 1-1.617-.598c-2.842-1.226-4.697-4.088-4.838-4.28-.141-.19-1.148-1.526-1.148-2.91 0-1.385.726-2.066 .984-2.347.258-.282.562-.352.75-.352l.535.01c.172.007.402-.065.629.481.24.573.811 1.983.882 2.126.07.142.117.309.023.496-.094.188-.14.304-.279.47-.14.166-.295.37-.421.497-.14.139-.286.29-.123.568.163.278.724 1.195 1.554 1.934 1.068.951 1.968 1.245 2.246 1.385.278.14.44.117.603-.07.163-.187.698-.814.884-1.092.187-.279.374-.233.632-.14.258.094 1.637.772 1.916.913.28.14.466.21.535.327.07.117.07.674-.17 1.348z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const ICON_MAP = {
  facebook: { Icon: FacebookIcon, label: "Facebook" },
  youtube: { Icon: YouTubeIcon, label: "YouTube" },
  zalo: { Icon: ZaloIcon, label: "Zalo" },
  tiktok: { Icon: TikTokIcon, label: "TikTok" },
} as const;

export function SocialIcons({ links, size = "md", theme = "light" }: SocialIconsProps) {
  const btnSize = size === "sm" ? "w-8 h-8 text-base" : "w-9 h-9 text-lg";

  const darkStyle = {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.9)",
  };
  const lightStyle = {
    backgroundColor: "var(--color-primary-light)",
    color: "var(--color-primary)",
  };
  const hoverDark = "hover:bg-white/30";
  const hoverLight = "hover:opacity-80";

  return (
    <div className="flex items-center gap-2">
      {(Object.keys(ICON_MAP) as Array<keyof typeof ICON_MAP>).map((key) => {
        const href = links[key];
        if (!href) return null;
        const { Icon, label } = ICON_MAP[key];
        return (
          <Link
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`${btnSize} rounded-full flex items-center justify-center transition-all duration-150 ${theme === "dark" ? hoverDark : hoverLight}`}
            style={theme === "dark" ? darkStyle : lightStyle}
          >
            <Icon />
          </Link>
        );
      })}
    </div>
  );
}
