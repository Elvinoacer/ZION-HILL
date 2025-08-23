// hooks/use-media-query.ts
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);

    // Add listener for modern browsers
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", listener);
    }
    // Fallback for older browsers
    else if (typeof media.addListener === "function") {
      media.addListener(listener);
    }

    // Cleanup function
    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", listener);
      } else if (typeof media.removeListener === "function") {
        media.removeListener(listener);
      }
    };
  }, [query, matches]);

  return matches;
}

// Alternative simplified version if you prefer:
/*
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Modern browsers
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } 
    // Legacy browsers
    else {
      media.addListener(handler);
      return () => media.removeListener(handler);
    }
  }, [query]);

  return matches;
}
*/
