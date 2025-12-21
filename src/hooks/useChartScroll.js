import { useRef, useEffect } from 'react';

// --- Custom Hook for Chart Scrolling ---
export const useChartScroll = (totalLength, visibleCount = 12) => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft =
                scrollContainerRef.current.scrollWidth;
        }
    }, [totalLength]);

    return { scrollContainerRef };
};
