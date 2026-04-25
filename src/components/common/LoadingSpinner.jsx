export default function LoadingSpinner({ size = 24, color = "var(--brand-primary)" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spinnerRotate 0.8s linear infinite" }}
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" strokeOpacity="0.2" />
      <path
        d="M12 3 a9 9 0 0 1 9 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
