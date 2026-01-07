import { useEffect, useState } from "react";
/**
 * This hook is intended to be used with a ref pointing to the **actual
 * rendered asset element** (e.g. <img>, <video>, or a layout-defining wrapper),
 * not a parent container.
 *
 * The size is updated:
 * - after the element is mounted
 * - whenever the element is resized (via ResizeObserver)
 *
 * @param {React.RefObject<HTMLElement>} ref
 * Ref pointing to the DOM element whose rendered size should be observed.
 * Example: imgRef, videoRef, canvasRef.
 *
 * @returns {{ width: number, height: number } | null}
 * The current size of the element in pixels, or null before the first
 * measurement is available.
 *
 * @remarks
 * - The hook measures `clientWidth` and `clientHeight`
 * - The element must be rendered and visible for measurements to be meaningful
 * - The hook does not perform any layout or styling itself
 * - ResizeObserver is automatically cleaned up on unmount
 */
export const useObservedSize = (ref) => {
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (!ref.current) return;

    const update = () => {
      const el = ref.current;
      setSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(ref.current);

    return () => ro.disconnect();
  }, []);

  return size;
};
