import { useState, useEffect } from "react";

export type Platform = "macos" | "windows" | "chromeos" | "android" | "ios" | "linux" | "unknown";
export type InputMode = "touch" | "pointer" | "hybrid";

interface PlatformInfo {
  platform: Platform;
  inputMode: InputMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  hasHover: boolean;
  isStandalone: boolean; // PWA mode
  prefersReducedMotion: boolean;
  screenWidth: number;
  screenHeight: number;
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator as any).userAgentData?.platform?.toLowerCase() || navigator.platform?.toLowerCase() || "";

  // iOS detection (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/.test(ua) || (platform === "macintel" && navigator.maxTouchPoints > 1)) {
    return "ios";
  }
  // Android detection (includes Pixel OS)
  if (/android/.test(ua)) {
    return "android";
  }
  // ChromeOS detection
  if (/cros/.test(ua)) {
    return "chromeos";
  }
  // macOS detection
  if (/mac/.test(platform) && navigator.maxTouchPoints <= 1) {
    return "macos";
  }
  // Windows detection
  if (/win/.test(platform)) {
    return "windows";
  }
  // Linux detection
  if (/linux/.test(platform)) {
    return "linux";
  }
  return "unknown";
}

function detectInputMode(): InputMode {
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  const hasHover = window.matchMedia("(hover: hover)").matches;

  if (hasTouch && hasFinePointer && hasHover) return "hybrid"; // ChromeOS, iPad with keyboard
  if (hasTouch && !hasFinePointer) return "touch";
  return "pointer";
}

export function usePlatform(): PlatformInfo {
  const [info, setInfo] = useState<PlatformInfo>(() => {
    const platform = detectPlatform();
    const inputMode = detectInputMode();
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      platform,
      inputMode,
      isMobile: w < 768,
      isTablet: w >= 768 && w < 1024,
      isDesktop: w >= 1024,
      isTouchDevice: inputMode === "touch" || inputMode === "hybrid",
      hasHover: window.matchMedia("(hover: hover)").matches,
      isStandalone: window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true,
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      screenWidth: w,
      screenHeight: h,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setInfo(prev => ({
        ...prev,
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        isDesktop: w >= 1024,
        screenWidth: w,
        screenHeight: h,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return info;
}

/**
 * Returns platform-specific keyboard shortcut display
 * macOS: ⌘  Windows/ChromeOS/Linux: Ctrl
 */
export function useModifierKey(): string {
  const { platform } = usePlatform();
  return platform === "macos" || platform === "ios" ? "⌘" : "Ctrl+";
}
