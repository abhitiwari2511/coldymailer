/**
 * Minimal polyfills for pdfjs-dist globals required in serverless environments.
 *
 * pdfjs-dist expects DOMMatrix, ImageData, and Path2D to exist on globalThis.
 * These are browser APIs that don't exist in Node.js / Vercel serverless runtimes.
 * Since we only do TEXT EXTRACTION (no rendering), lightweight stubs are sufficient.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function ensurePolyfills() {
  const g = globalThis as any;

  // DOMMatrix stub — pdfjs uses it for transform math during text extraction
  if (!g.DOMMatrix) {
    g.DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      m11 = 1; m12 = 0; m13 = 0; m14 = 0;
      m21 = 0; m22 = 1; m23 = 0; m24 = 0;
      m31 = 0; m32 = 0; m33 = 1; m34 = 0;
      m41 = 0; m42 = 0; m43 = 0; m44 = 1;
      is2D = true;
      isIdentity = true;

      constructor(init?: any) {
        if (Array.isArray(init) && init.length === 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init;
          this.m11 = this.a; this.m12 = this.b;
          this.m21 = this.c; this.m22 = this.d;
          this.m41 = this.e; this.m42 = this.f;
          this.isIdentity = false;
        } else if (Array.isArray(init) && init.length === 16) {
          [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44,
          ] = init;
          this.a = this.m11; this.b = this.m12;
          this.c = this.m21; this.d = this.m22;
          this.e = this.m41; this.f = this.m42;
          this.is2D = false;
          this.isIdentity = false;
        }
      }

      multiply(other: any) {
        const result = new DOMMatrix();
        result.a = this.a * other.a + this.c * other.b;
        result.b = this.b * other.a + this.d * other.b;
        result.c = this.a * other.c + this.c * other.d;
        result.d = this.b * other.c + this.d * other.d;
        result.e = this.a * other.e + this.c * other.f + this.e;
        result.f = this.b * other.e + this.d * other.f + this.f;
        return result;
      }

      translate(tx: number, ty: number, _tz?: number) {
        const t = new DOMMatrix([1, 0, 0, 1, tx, ty]);
        return this.multiply(t);
      }

      scale(sx: number, sy?: number) {
        const s = new DOMMatrix([sx, 0, 0, sy ?? sx, 0, 0]);
        return this.multiply(s);
      }

      inverse() {
        const det = this.a * this.d - this.b * this.c;
        if (det === 0) return new DOMMatrix();
        const invDet = 1 / det;
        return new DOMMatrix([
          this.d * invDet,
          -this.b * invDet,
          -this.c * invDet,
          this.a * invDet,
          (this.c * this.f - this.d * this.e) * invDet,
          (this.b * this.e - this.a * this.f) * invDet,
        ]);
      }

      transformPoint(point?: { x?: number; y?: number }) {
        const x = point?.x ?? 0;
        const y = point?.y ?? 0;
        return {
          x: this.a * x + this.c * y + this.e,
          y: this.b * x + this.d * y + this.f,
        };
      }

      static fromMatrix(other: any) {
        return new DOMMatrix([other.a, other.b, other.c, other.d, other.e, other.f]);
      }

      static fromFloat32Array(arr: Float32Array) {
        return new DOMMatrix(Array.from(arr));
      }

      static fromFloat64Array(arr: Float64Array) {
        return new DOMMatrix(Array.from(arr));
      }
    };
  }

  // ImageData stub — only needed for rendering, not text extraction
  if (!g.ImageData) {
    g.ImageData = class ImageData {
      data: Uint8ClampedArray;
      width: number;
      height: number;
      colorSpace = "srgb";

      constructor(sw: number | Uint8ClampedArray, sh?: number, _settings?: any) {
        if (typeof sw === "number") {
          this.width = sw;
          this.height = sh ?? 0;
          this.data = new Uint8ClampedArray(this.width * this.height * 4);
        } else {
          this.data = sw;
          this.width = sh ?? 0;
          this.height = this.data.length / (4 * this.width);
        }
      }
    };
  }

  // Path2D stub — only needed for canvas rendering
  if (!g.Path2D) {
    g.Path2D = class Path2D {
      constructor(_path?: string | Path2D) {
        // no-op stub for text extraction
      }
      addPath() {}
      moveTo() {}
      lineTo() {}
      bezierCurveTo() {}
      quadraticCurveTo() {}
      arc() {}
      arcTo() {}
      ellipse() {}
      rect() {}
      closePath() {}
    };
  }
}

ensurePolyfills();

export {};
