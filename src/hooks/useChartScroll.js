import { useRef, useEffect } from 'react';

// --- Custom Hook for Chart Scrolling ---
export const useChartScroll = (totalLength, visibleCount = 12, extraDeps = []) => {
    const scrollContainerRef = useRef(null);
    const isInitialMount = useRef(true);

    const scrollToEnd = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft =
                scrollContainerRef.current.scrollWidth;
        }
    };

    useEffect(() => {
        // 초기 마운트 시에는 차트 렌더링을 기다리기 위해 약간 지연
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // 초기 로드 시 차트 렌더링 완료를 기다림
            const timer = setTimeout(() => {
                requestAnimationFrame(scrollToEnd);
            }, 100);
            return () => clearTimeout(timer);
        }

        // 이후 업데이트 시에는 즉시 스크롤
        requestAnimationFrame(scrollToEnd);
    }, [totalLength, ...extraDeps]);

    return { scrollContainerRef };
};

