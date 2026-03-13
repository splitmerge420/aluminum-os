import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
}

interface WindowContextType {
  windows: WindowState[];
  openWindow: (appId: string, title: string, icon: string, width?: number, height?: number) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  activeWindowId: string | null;
}

const WindowContext = createContext<WindowContextType | null>(null);

let nextZIndex = 100;
let windowCounter = 0;

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const openWindow = useCallback((appId: string, title: string, icon: string, width = 800, height = 550) => {
    const existing = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existing) {
      focusWindow(existing.id);
      return;
    }
    const minimized = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimized) {
      restoreWindow(minimized.id);
      focusWindow(minimized.id);
      return;
    }

    windowCounter++;
    const id = `window-${windowCounter}`;
    nextZIndex++;
    const offset = (windowCounter % 8) * 30;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      icon,
      x: 100 + offset,
      y: 60 + offset,
      width,
      height,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      zIndex: nextZIndex,
    };
    setWindows(prev => [
      ...prev.map(w => ({ ...w, isFocused: false })),
      newWindow,
    ]);
    setActiveWindowId(id);
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => {
      const remaining = prev.filter(w => w.id !== id);
      if (remaining.length > 0) {
        const topWindow = remaining.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
        return remaining.map(w => ({ ...w, isFocused: w.id === topWindow.id }));
      }
      return remaining;
    });
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    nextZIndex++;
    setWindows(prev =>
      prev.map(w => ({
        ...w,
        isFocused: w.id === id,
        zIndex: w.id === id ? nextZIndex : w.zIndex,
      }))
    );
    setActiveWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
      )
    );
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isMaximized: true } : w
      )
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    nextZIndex++;
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, isMaximized: false, isMinimized: false, isFocused: true, zIndex: nextZIndex } : { ...w, isFocused: false }
      )
    );
    setActiveWindowId(id);
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, x, y } : w))
    );
  }, []);

  const resizeWindow = useCallback((id: string, width: number, height: number) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, width, height } : w))
    );
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        moveWindow,
        resizeWindow,
        activeWindowId,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used within WindowProvider");
  return ctx;
}
