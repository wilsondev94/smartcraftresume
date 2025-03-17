import { useEffect, useState } from "react";

export function useDimensions(
  containerRef: React.RefObject<HTMLElement | null>
) {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const currentRef = containerRef.current;

    function getDimension() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions(getDimension());
      }
    });

    if (currentRef) {
      resizeObserver.observe(currentRef);
      setDimensions(getDimension());
    }

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }

      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}
