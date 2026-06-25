import { useEffect, useRef } from 'react';

export interface CanvasShape {
  type: 'rect' | 'circle' | 'line' | 'text';
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  x2?: number;
  y2?: number;
  color?: string;
  text?: string;
}

export interface BIQCanvasProps {
  width: number;
  height: number;
  backgroundUrl?: string;
  shapes?: CanvasShape[];
  ariaLabel?: string;
}

/**
 * BIQCanvas — minimal 2D canvas renderer (POC). For full interactive
 * editing (drag, resize, layer reorder, drawing tools, undo/redo) this
 * upgrades to react-konva in a future wave. The shapes prop is a static
 * snapshot for now.
 *
 * Chosen lightweight HTMLCanvasElement over react-konva to keep bundle
 * lean — react-konva is ~80 KB gzip, vs zero for this minimal renderer.
 */
export function BIQCanvas({
  width,
  height,
  backgroundUrl,
  shapes = [],
  ariaLabel = 'Image editor canvas',
}: BIQCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || typeof c.getContext !== 'function') return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const drawShapes = () => {
      for (const s of shapes) {
        ctx.strokeStyle = s.color ?? '#435d7d';
        ctx.fillStyle = s.color ?? '#435d7d';
        ctx.lineWidth = 2;
        if (s.type === 'rect') {
          ctx.strokeRect(s.x, s.y, s.w ?? 0, s.h ?? 0);
        } else if (s.type === 'circle') {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r ?? 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (s.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x2 ?? s.x, s.y2 ?? s.y);
          ctx.stroke();
        } else if (s.type === 'text') {
          ctx.font = '14px system-ui, sans-serif';
          ctx.fillText(s.text ?? '', s.x, s.y);
        }
      }
    };

    if (backgroundUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        drawShapes();
      };
      img.onerror = () => {
        // Fallback: gray panel if background load fails
        ctx.fillStyle = '#e9ecef';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#868e96';
        ctx.font = '14px system-ui, sans-serif';
        ctx.fillText(`(Image unavailable: ${backgroundUrl})`, 12, 24);
        drawShapes();
      };
      img.src = backgroundUrl;
    } else {
      ctx.fillStyle = '#e9ecef';
      ctx.fillRect(0, 0, width, height);
      drawShapes();
    }
  }, [width, height, backgroundUrl, shapes]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel}
      data-testid="biq-canvas"
      style={{ border: '1px solid #ced4da', borderRadius: 4 }}
    />
  );
}
