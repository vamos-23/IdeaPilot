const DIFFICULTY_STYLES = {
  Beginner: {
    border: "border border-emerald-500/65",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Beginner",
    iconLight: "#059669",
    iconDark: "#10b981",
  },
  Intermediate: {
    border: "border border-amber-500/65",
    text: "text-amber-600 dark:text-amber-400/90",
    bg: "bg-amber-500/10",
    label: "Intermediate",
    iconLight: "#d97706",
    iconDark: "#fbbf24",
  },
  Advanced: {
    border: "border border-rose-500/65",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    label: "Advanced",
    iconLight: "#e11d48",
    iconDark: "#fb7185",
  },
} as const;

export { DIFFICULTY_STYLES };