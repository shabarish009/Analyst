import '@testing-library/jest-dom'

// Polyfills for CodeMirror in jsdom: Range.getClientRects and getBoundingClientRect
if (typeof (global as any).Range !== 'undefined') {
  const rangeProto = (global as any).Range.prototype as any
  if (!rangeProto.getClientRects) {
    rangeProto.getClientRects = () => []
  }
  if (!rangeProto.getBoundingClientRect) {
    rangeProto.getBoundingClientRect = () => ({
      x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, toJSON() {}
    })
  }
}

// Fallback for Element.getClientRects used by measurement layers
if (!(Element.prototype as any).getClientRects) {
  (Element.prototype as any).getClientRects = () => []
}

