/**
 * Thin localStorage wrapper.
 * All persistence goes through here — swap for sessionStorage or IndexedDB without touching callers.
 */
export const localStorageService = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // quota exceeded or private browsing — fail silently
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.removeItem('nbt_progress');
    localStorage.removeItem('nbt_submitted');
  },
};
