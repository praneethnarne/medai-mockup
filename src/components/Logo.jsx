export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="size-6 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21" strokeLinecap="round" />
      </svg>
      <span className="text-lg font-bold tracking-tight">MEdAI</span>
    </span>
  );
}
