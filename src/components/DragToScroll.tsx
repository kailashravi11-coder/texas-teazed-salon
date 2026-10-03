import { useEffect } from 'react';

export function DragToScroll() {
  useEffect(() => {
    let isMouseDown = false;
    let startY = 0;
    let initialScroll = 0;
    let hasDragged = false;

    const onMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        // Do not intercept on input, textarea, select, or option
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || tagName === 'option') {
          return;
        }
      }

      isMouseDown = true;
      hasDragged = false;
      startY = e.clientY;
      initialScroll = window.scrollY || document.documentElement.scrollTop || 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaY = e.clientY - startY;

      // Small threshold (4px) before activating drag to scroll
      if (!hasDragged && Math.abs(deltaY) > 4) {
        hasDragged = true;
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
      }

      if (hasDragged) {
        // Direct finger-like scroll tracking: dragging mouse down scrolls content up
        const targetScroll = initialScroll - deltaY;
        window.scrollTo(0, targetScroll);
      }
    };

    const onMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;

      if (hasDragged) {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.userSelect = '';
        document.body.style.cursor = '';

        // Prevent click trigger on button/link after drag gesture completes
        const captureClick = (e: MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();
        };
        window.addEventListener('click', captureClick, { capture: true, once: true });
        setTimeout(() => {
          window.removeEventListener('click', captureClick, { capture: true });
        }, 150);
      }
      hasDragged = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.style.scrollBehavior = '';
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  return null;
}
