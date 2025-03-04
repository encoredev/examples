import { useSyncExternalStore } from 'react';

export enum ScreenSize {
    Mobile = 'mobile',
    Tablet = 'tablet',
    Desktop = 'desktop',
    Wide = 'wide',
    UltraWide = 'ultraWide',
    SuperWide = 'superWide',
    Cinematic = 'cinematic'
}

function useMediaQuery(query: string): boolean {
    const matches = useSyncExternalStore(
        (callback) => {
            const mediaQuery = window.matchMedia(query);
            mediaQuery.addEventListener('change', callback);
            return () => mediaQuery.removeEventListener('change', callback);
        },
        () => window.matchMedia(query).matches,
        () => false
    );

    return matches;
}

export function useResponsive() {
    const isMobile = useMediaQuery('(min-width: 280px) and (max-width: 768px)');
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1279px)');
    const isDesktop = useMediaQuery('(min-width: 1280px) and (max-width: 1919px)');
    const isWide = useMediaQuery('(min-width: 1920px) and (max-width: 2559px)');
    const isUltraWide = useMediaQuery('(min-width: 2560px) and (max-width: 3199px)');
    const isSuperWide = useMediaQuery('(min-width: 3200px) and (max-width: 3839px)');
    const isCinematic = useMediaQuery('(min-width: 3840px)');

    const getScreenSize = (): ScreenSize => {
        if (isMobile) return ScreenSize.Mobile;
        if (isTablet) return ScreenSize.Tablet;
        if (isDesktop) return ScreenSize.Desktop;
        if (isWide) return ScreenSize.Wide;
        if (isUltraWide) return ScreenSize.UltraWide;
        if (isSuperWide) return ScreenSize.SuperWide;
        if (isCinematic) return ScreenSize.Cinematic;
        return ScreenSize.Desktop; // Default fallback
    };

    return {
        isMobile,
        isTablet,
        isDesktop,
        isLargeScreen: isWide || isUltraWide || isSuperWide || isCinematic,
        screenSize: getScreenSize()
    };
}
