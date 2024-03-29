import {
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  Self,
} from '@angular/core';

@Component({
  selector: 'ninja-splitter',
  template: '',
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
})
export class NinjaSplitterComponent implements OnChanges, AfterViewInit {
  @ViewChild('primaryComponent', { static: true }) primaryComponent: ElementRef;
  @ViewChild('secondaryComponent', { static: true })
  secondaryComponent: ElementRef;

  @Input('primary-component-initialratio') initialRatio = 0.5;
  @Input('primary-minsize') primaryMinSize = 0;
  @Input('secondary-minsize') secondaryMinSize = 0;
  @Input('separator-width-px') separatorThickness = 5;
  @Input('primary-component-toggle') primaryToggledOff = false;
  @Input('secondary-component-toggle') secondaryToggledOff = false;
  @Input('local-storage-key') localStorageKey: string | null = null;
  @Output('on-change')
  notifySizeDidChange: EventEmitter<{primary: number, secondary: number}> = new EventEmitter<{primary: number, secondary: number}>();
  @Output('on-begin-resizing')
  notifyBeginResizing: EventEmitter<void> = new EventEmitter<void>();
  @Output('on-ended-resizing')
  notifyEndedResizing: EventEmitter<void> = new EventEmitter<void>();

  public get isHorizontal(): boolean {
    return this.self.nativeElement.nodeName === 'HORIZONTAL-NINJA';
  }

  constructor(@Self() protected self: ElementRef) { }

  primarySizeBeforeTogglingOff: number;
  dividerSize = 8.0;
  isResizing = false;
  protected get sizePropertyName(): 'offsetWidth' | 'offsetHeight' {
    if (
      (this.self.nativeElement.nodeName as string).toUpperCase() ===
      'HORIZONTAL-NINJA'
    ) {
      return 'offsetHeight';
    } else {
      return 'offsetWidth';
    }
  }

  ngAfterViewInit(): void {
    this.checkBothToggledOff();

    if (!this.primaryToggledOff && !this.secondaryToggledOff) {
      let ratio: number = this.initialRatio;
      if (this.localStorageKey != null) {
        const ratioStr = localStorage.getItem(this.localStorageKey);
        if (ratioStr != null) {
          ratio = +ratioStr;
        }
      }

      const size = ratio * this.self.nativeElement[this.sizePropertyName];
      this.applySizeChange(size);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkBothToggledOff();

    if (changes.primaryToggledOff) {
      if (changes.primaryToggledOff.currentValue === true) {
        this.primarySizeBeforeTogglingOff = this.getPrimarySize();
        this.applySizeChange(0);
      } else {
        this.applySizeChange(this.primarySizeBeforeTogglingOff);
      }
    } else if (changes.secondaryToggledOff) {
      if (changes.secondaryToggledOff.currentValue === true) {
        this.primarySizeBeforeTogglingOff = this.getPrimarySize();
        this.applySizeChange(this.self.nativeElement[this.sizePropertyName]);
      } else {
        this.applySizeChange(this.primarySizeBeforeTogglingOff);
      }
    }
  }

  getPrimarySize(): number {
    throw new Error(
      "NinjaSplitterComponent shouldn't be instantiated. Override this method."
    );
  }

  getSecondarySize(): number {
    throw new Error(
      "NinjaSplitterComponent shouldn't be instantiated. Override this method."
    );
  }

  dividerPosition(size: number): void {
    throw new Error(
      "NinjaSplitterComponent shouldn't be instantiated. Override this method."
    );
  }

  getAvailableSize(): number {
    return this.self.nativeElement[this.sizePropertyName] - this.dividerSize;
  }

  applySizeChange(size: number): void {
    let primarySize = this.checkValidBounds(
      size,
      this.primaryMinSize,
      this.getAvailableSize() - this.secondaryMinSize
    );

    if (this.primaryToggledOff) {
      primarySize = 0;
    } else if (this.secondaryToggledOff) {
      primarySize = this.self.nativeElement[this.sizePropertyName];
    }

    this.dividerPosition(primarySize);
    this.notifySizeDidChange.emit({
      primary: this.getPrimarySize(),
      secondary: this.getSecondarySize(),
    });
  }

  notifyWillChangeSize(resizing: boolean): void {
    this.isResizing = resizing;
    this.notifyBeginResizing.emit();
  }

  checkValidBounds(newSize: number, minSize: number, maxSize: number): number {
    if (newSize >= minSize && newSize <= maxSize) {
      return newSize;
    } else if (maxSize - newSize > 0) {
      return minSize;
    } else {
      return maxSize;
    }
  }

  checkBothToggledOff(): void {
    if (this.primaryToggledOff && this.secondaryToggledOff) {
      throw new Error(
        'You cannot toggle off both the primary and secondary component'
      );
    }
  }

  stopResizing(): void {
    this.isResizing = false;
    this.primaryComponent.nativeElement.style.cursor = 'auto';
    this.secondaryComponent.nativeElement.style.cursor = 'auto';

    if (this.localStorageKey != null) {
      const ratio =
        this.getPrimarySize() / this.self.nativeElement[this.sizePropertyName];
      localStorage.setItem(this.localStorageKey, JSON.stringify(ratio));
    }

    this.notifyEndedResizing.emit();
  }

  @HostListener('mouseup')
  @HostListener('touchend')
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
