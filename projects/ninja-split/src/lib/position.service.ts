import { ElementRef } from '@angular/core';
// @dynamic
export class PositionService {
  /**
   * Provides read-only equivalent of jQuery's position function:
   * http://api.jquery.com/position/
   */
  public static position(element: ElementRef): { width: number, height: number, top: number, left: number } {
    const nativeEl: any = element.nativeElement;
    const elBCR = this.offset(nativeEl);
    let offsetParentBCR = { top: 0, left: 0 };
    const offsetParentEl = this.parentOffsetEl(nativeEl);
    if (offsetParentEl !== this.document) {
      offsetParentBCR = this.offset(offsetParentEl);
      offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: elBCR.top - offsetParentBCR.top,
      left: elBCR.left - offsetParentBCR.left
    };
  }

  /**
   * Provides read-only equivalent of jQuery's offset function:
   * http://api.jquery.com/offset/
   */
  public static offset(element: ElementRef): { width: number, height: number, top: number, left: number } {
    const nativeEl: any = element.nativeElement;
    const boundingClientRect = nativeEl.getBoundingClientRect();
    return {
      width: boundingClientRect.width || nativeEl.offsetWidth,
      height: boundingClientRect.height || nativeEl.offsetHeight,
      top: boundingClientRect.top + (this.window.pageYOffset || this.document.documentElement.scrollTop),
      left: boundingClientRect.left + (this.window.pageXOffset || this.document.documentElement.scrollLeft)
    };
  }

  /**
   * Provides coordinates for the targetEl in relation to hostEl
   */
  public static positionElements(host: ElementRef, target: ElementRef, positionStr: any, appendToBody: any): { top: number, left: number } {
    const hostEl: any = host.nativeElement;
    const targetEl: any = target.nativeElement;
    const positionStrParts = positionStr.split('-');
    const pos0 = positionStrParts[0];
    const pos1 = positionStrParts[1] || 'center';
    const baseElementPos = appendToBody ?
      this.offset(hostEl) :
      this.position(hostEl);
    const targetElWidth = targetEl.offsetWidth;
    const targetElHeight = targetEl.offsetHeight;

    const shiftWidth = {
      center: () => baseElementPos.left + baseElementPos.width / 2 - targetElWidth / 2,
      left: () => baseElementPos.left,
      right: () => baseElementPos.left + baseElementPos.width
    };

    const shiftHeight = {
      center: () => baseElementPos.top + baseElementPos.height / 2 - targetElHeight / 2,
      top: () => baseElementPos.top,
      bottom: () => baseElementPos.top + baseElementPos.height
    };

    let targetElementPos: { top: number, left: number };
    switch (pos0) {
      case 'right':
        targetElementPos = {
          top: shiftHeight[pos1](),
          left: shiftWidth[pos0]()
        };
        break;
      case 'left':
        targetElementPos = {
          top: shiftHeight[pos1](),
          left: baseElementPos.left - targetElWidth
        };
        break;
      case 'bottom':
        targetElementPos = {
          top: shiftHeight[pos0](),
          left: shiftWidth[pos1]()
        };
        break;
      default:
        targetElementPos = {
          top: baseElementPos.top - targetElHeight,
          left: shiftWidth[pos1]()
        };
        break;
    }

    return targetElementPos;
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
    // finally try and get inline style
    return nativeEl.style[cssProp];
  }

  /**
   * Checks if a given element is statically positioned
   * @param nativeEl - raw DOM element
   */
  private static isStaticPositioned(nativeEl: any): any {
    return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
  }

  /**
   * returns the closest, non-statically positioned parentOffset of a given element
   * @param nativeEl - raw DOM element
   */
  private static parentOffsetEl(nativeEl: any): any {
    let offsetParent = nativeEl.offsetParent || this.document;
    while (offsetParent && offsetParent !== this.document &&
      this.isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }
    return offsetParent || this.document;
  };
}
