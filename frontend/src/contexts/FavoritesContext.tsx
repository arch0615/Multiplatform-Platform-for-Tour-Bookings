import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { ApiError } from "@/lib/api";
import { addFavorite, listMyFavoriteIds, removeFavorite } from "@/lib/favorites";

type FavoritesContextValue = {
  ids: Set<string>;
  loading: boolean;
  isFavorite: (tourId: string) => boolean;
  toggle: (tourId: string) => Promise<boolean>; // returns the new favorited state
  refresh: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const list = await listMyFavoriteIds();
      setIds(new Set(list));
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
      setIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { refresh(); }, [refresh]);

  const isFavorite = useCallback((tourId: string) => ids.has(tourId), [ids]);

  const toggle = useCallback(async (tourId: string): Promise<boolean> => {
    const was = ids.has(tourId);
    // Optimistic update
    setIds((prev) => {
      const next = new Set(prev);
      if (was) next.delete(tourId); else next.add(tourId);
      return next;
    });
    try {
      if (was) await removeFavorite(tourId);
      else await addFavorite(tourId);
      return !was;
    } catch (err) {
      // Roll back on failure
      setIds((prev) => {
        const next = new Set(prev);
        if (was) next.add(tourId); else next.delete(tourId);
        return next;
      });
      throw err;
    }
  }, [ids]);

  return (
    <FavoritesContext.Provider value={{ ids, loading, isFavorite, toggle, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
