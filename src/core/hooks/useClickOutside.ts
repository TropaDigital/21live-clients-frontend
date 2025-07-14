import { useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useClickOutside = (ref: any, handler: (event: Event) => void) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Não faz nada se clicar no elemento ou em seus descendentes
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
