export interface EmotionItem {
  emotion: string;
  text?: string;
  time: string;
}

export function saveEmotionHistory(item: EmotionItem) {

  const existing = JSON.parse(
    localStorage.getItem("movesync_history") || "[]"
  );

  existing.push(item);

  localStorage.setItem(
    "movesync_history",
    JSON.stringify(existing)
  );
}

export function getEmotionHistory(): EmotionItem[] {

  const data = localStorage.getItem("movesync_history");

  if (!data) return [];

  return JSON.parse(data);
}