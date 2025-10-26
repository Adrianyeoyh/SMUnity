export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}