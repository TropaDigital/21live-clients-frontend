export function getFileTypeFromURL(
  url: string
): "image" | "pdf" | "video" | "doc" | "zip" | "other" {
  const extension = url.split(".").pop()?.toLowerCase();

  if (!extension) return "other";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const pdfExtensions = ["pdf"];
  const videoExtensions = ["mp4", "mov", "avi", "webm", "mkv"];

  if (imageExtensions.includes(extension)) return "image";
  if (pdfExtensions.includes(extension)) return "pdf";
  if (videoExtensions.includes(extension)) return "video";

  return "other";
}
