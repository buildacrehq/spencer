// Emoji icons matching the section markers used in the real Buildacre PDF
// quotations (e.g. "Mr.Ravi Kumar NS (KR Puram).pdf") — shown next to spec
// category titles for quick visual scanning. Falls back to no icon for
// custom/unrecognized category names (user-added categories).
const ICONS: Record<string, string> = {
  "Materials": "🧱",
  "Core Materials": "🧱",
  "Warranty": "🛡️",
  "Design & Drawings": "✏️",
  "Earthwork": "🌍",
  "RCC & Masonry": "🧱",
  "Kitchen": "🍽️",
  "Bathroom": "🚿",
  "Doors & Windows": "🚪",
  "Painting": "🎨",
  "Flooring": "🧱",
  "Electrical": "⚡",
  "Technical Information": "📊",
};

export function categoryIcon(title: string): string | null {
  return ICONS[title.trim()] ?? null;
}
