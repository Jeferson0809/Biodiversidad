import { useEffect, useState } from 'react';

// Versión de esquema. Subir cuando cambie la forma de los datos para purgar
// entries viejas potencialmente corruptas (p. ej. fechas guardadas como array
// por el bug histórico de `.split('T')` sin `[0]`).
const SCHEMA_VERSION = 'v2';

export function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const versionedKey = `${key}_${SCHEMA_VERSION}`;

  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(versionedKey);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(versionedKey, JSON.stringify(value));
    } catch {
      // ignore quota / private mode
    }
  }, [versionedKey, value]);

  return [value, setValue];
}
