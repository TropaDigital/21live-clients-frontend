export const getVideoEmbedUrl = (host: string, code: string) => {
  if (!code) return "";
  switch (host) {
    case "youtube":
      return `https://www.youtube.com/embed/${code}`;
    case "vimeo": // Vimeo
      return `https://player.vimeo.com/video/${code}`;
    case "loom":
      return `https://www.loom.com/${code}`;
    default:
      return "";
  }
};

export const extractVideoCodeFromUrl = (url: string, host: string): string => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    switch (host) {
      case "youtube":
        if (parsed.hostname.includes("youtu.be")) {
          return parsed.pathname.slice(1); // https://youtu.be/abcd123
        }
        if (parsed.pathname.startsWith("/embed/")) {
          return parsed.pathname.split("/embed/")[1]; // https://www.youtube.com/embed/abcd123
        }
        return parsed.searchParams.get("v") || ""; // https://youtube.com/watch?v=abcd123

      case "vimeo":
      case "loom":
        return parsed.pathname.split("/").filter(Boolean).pop() || "";

      default:
        return "";
    }
  } catch {
    return url; // fallback
  }
};

export const detectVideoHost = (
  url: string
): "youtube" | "vimeo" | "loom" | "unknown" => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  if (url.includes("loom.com")) return "loom";
  return "unknown";
};
