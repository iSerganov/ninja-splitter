import {
  Component, ViewChild, ElementRef, HostListener, EventEmitter, Input,
  Output, OnChanges, SimpleChanges
} from '@angular/core';

@Component({
  selector: 'ninja-splitter',
  template: '',
  host: { 'style': 'height: 100%' }
})
export class NinjaSplitterComponent implements OnChanges {

  @ViewChild('primaryComponent', { static: true }) primaryComponent: ElementRef;
  @ViewChild('secondaryComponent', { static: true }) secondaryComponent: ElementRef;

  @Input('primary-component-initialratio') initialRatio: number = 0.5;
  @Input('primary-minsize') primaryMinSize: number = 0;
  @Input('secondary-minsize') secondaryMinSize: number = 0;
  @Input('separator-width-px') separatorThickness: number = 5;
  @Input('primary-component-toggle') primaryToggledOff: boolean = false;
  @Input('secondary-component-toggle') secondaryToggledOff: boolean = false;
  @Input('local-storage-key') localStorageKey: string | null = null;
  @Output('on-change') notifySizeDidChange: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-begin-resizing') notifyBeginResizing: EventEmitter<any> = new EventEmitter<any>();
  @Output('on-ended-resizing') notifyEndedResizing: EventEmitter<any> = new EventEmitter<any>();

  primarySizeBeforeTogglingOff: number;
  dividerSize: number = 8.0;
  isResizing: boolean = false;

  ngAfterViewInit() {
    this.checkBothToggledOff();

    if (!this.primaryToggledOff && !this.secondaryToggledOff) {
      let ratio: number = this.initialRatio;
      if (this.localStorageKey != null) {
        const ratioStr = localStorage.getItem(this.localStorageKey);
        if (ratioStr != null) {
          ratio = JSON.parse(ratioStr);
        }
      }

      const size = ratio * this.getTotalSize();
      this.applySizeChange(size);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkBothToggledOff();

    if (changes['primaryToggledOff']) {
      if (changes['primaryToggledOff'].currentValue === true) {
        this.primarySizeBeforeTogglingOff = this.getPrimarySize();
        this.applySizeChange(0);
      } else {
        this.applySizeChange(this.primarySizeBeforeTogglingOff);
      }
    } else if (changes['secondaryToggledOff']) {
      if (changes['secondaryToggledOff'].currentValue === true) {
        this.primarySizeBeforeTogglingOff = this.getPrimarySize();
        this.applySizeChange(this.getTotalSize());
      } else {
        this.applySizeChange(this.primarySizeBeforeTogglingOff);
      }
    }
  }

  getTotalSize(): number {
    throw ('NinjaSplitterComponent shouldn\'t be instantiated. Override this method.')
  }

  getPrimarySize(): number {
    throw ('NinjaSplitterComponent shouldn\'t be instantiated. Override this method.')
  }

  getSecondarySize(): number {
    throw ('NinjaSplitterComponent shouldn\'t be instantiated. Override this method.')
  }

  dividerPosition(size: number): void {
    throw ('NinjaSplitterComponent shouldn\'t be instantiated. Override this method.')
  }

  getAvailableSize(): number {
    return this.getTotalSize() - this.dividerSize;
  }

  applySizeChange(size: number) {
    let primarySize = this.checkValidBounds(
      size, this.primaryMinSize,
      this.getAvailableSize() - this.secondaryMinSize);

    if (this.primaryToggledOff) {
      primarySize = 0;
    } else if (this.secondaryToggledOff) {
      primarySize = this.getTotalSize();
    }

    this.dividerPosition(primarySize);
    this.notifySizeDidChange.emit({ primary: this.getPrimarySize(), secondary: this.getSecondarySize() });
  }

  notifyWillChangeSize(resizing: boolean) {
    this.isResizing = resizing;
    this.notifyBeginResizing.emit();
  }

  checkValidBounds(newSize: number, minSize: number, maxSize: number): number {
    return newSize >= minSize
      ? (newSize <= maxSize)
        ? newSize
        : maxSize
      : minSize;
  }

  checkBothToggledOff() {
    // We do not allow both the primary and secondary content to be toggled off
    // at the same time, because then it would be very confusing.
    if (this.primaryToggledOff && this.secondaryToggledOff) {
      throw ('You cannot toggle off both the primary and secondary component');
    }
  }

  stopResizing() {
    this.isResizing = false;
    this.primaryComponent.nativeElement.style.cursor = 'auto';
    this.secondaryComponent.nativeElement.style.cursor = 'auto';

    if (this.localStorageKey != null) {
      const ratio = this.getPrimarySize() / (this.getTotalSize());
      localStorage.setItem(this.localStorageKey, JSON.stringify(ratio));
    }

    this.notifyEndedResizing.emit();
  }

  @HostListener('mouseup', ['$event'])
  @HostListener('touchend', ['$event'])
  onMouseup(): void {
    if (this.isResizing) {
      this.stopResizing();
    }
  }

  @HostListener('document:mouseout', ['$event'])
  onDocumentLeave(event): void {
    if (this.isResizing) {
      event = event ? event : window.event;
      const from = event.relatedTarget || event.toElement;
      if (!from || from.nodeName === 'HTML') {
        this.stopResizing();
      }
    }
  }
}