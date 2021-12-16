import { ElementRef } from '@angular/core';
// @dynamic
export class PositionService {
  public static position(
    element: ElementRef
  ): { width: number; height: number; top: number; left: number } {
    const nativeEl: any = element.nativeElement;
    const elBCR = this.offset(nativeEl);
    let offsetParentBCR = { top: 0, left: 0 };
    const offsetParentEl = this.parentOffsetEl(nativeEl);
    if (offsetParentEl !== this.document) {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top +=
        offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left +=
        offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left,
    };
  }

  public static offset(
    element: ElementRef
  ): { width: number; height: number; top: number; left: number } {
    const nativeEl: any = element.nativeElement;
    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top:
        boundingClientRect.top +
        (this.window.pageYOffset || this.document.documentElement.scrollTop),
      left:
        boundingClientRect.left +
        (this.window.pageXOffset || this.document.documentElement.scrollLeft),
    };
  }

  private static get window(): Window {
    return window;
  }

  private static get document(): Document {
    return window.document;
  }

  private static getStyle(nativeEl: any, cssProp: string): any {
    // IE
    if (nativeEl.currentStyle) {
      return nativeEl.currentStyle[cssProp];
    }

    if (this.window.getComputedStyle) {
      return this.window.getComputedStyle(nativeEl)[cssProp];
    }
    return nativeEl.style[cssProp];
  }

  private static isStaticPositioned(nativeEl: any): any {
    return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
  }

  private static parentOffsetEl(nativeEl: any): any {
    let offsetParent = nativeEl.offsetParent || this.document;
    while (
      offsetParent &&
      offsetParent !== this.document &&
      this.isStaticPositioned(offsetParent)
    ) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || this.document;
  }
}
