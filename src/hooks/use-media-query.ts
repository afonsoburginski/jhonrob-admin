// hooks/use-media-query.ts
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange(); // Set the initial state
    mediaQuery.addEventListener('change', handleChange); // Add event listener

    return () => {
      mediaQuery.removeEventListener('change', handleChange); // Clean up the event listener
    };
  }, [query]);

  return matches;
}
