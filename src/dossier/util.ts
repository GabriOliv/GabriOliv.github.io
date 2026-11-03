/** Joins the truthy class names with spaces, as Dossier's `cls`. */
export function cls(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Uppercases strings and passes anything else through, as Dossier's `up`. */
export function up<T>(value: T): T {
  return (typeof value === "string" ? value.toUpperCase() : value) as T;
}
