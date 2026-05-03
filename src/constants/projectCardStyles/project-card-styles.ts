const DIFFICULTY_STYLES = {
  Beginner: {
    border: "border-emerald-500/65",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Beginner",
  },
  Intermediate: {
    border: "border-amber-500/65",
    text: "text-amber-600 dark:text-amber-400/90",
    bg: "bg-amber-500/10",
    label: "Intermediate",
  },
  Advanced: {
    border: "border-rose-500/65",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    label: "Advanced",
  },
} as const;

export { DIFFICULTY_STYLES };
