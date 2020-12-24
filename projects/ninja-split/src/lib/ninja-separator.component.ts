import { Component, HostListener, EventEmitter, Input, Output, HostBinding } from '@angular/core';

@Component({
  selector: 'ninja-separator',
  styleUrls: ['ninja-separator.component.scss'],
  template: `
    <div class="handle"></div>
  `
})
export class NinjaSeparatorComponent {
  @Input() thickness: number;
  @Input() @HostBinding('class.horizontal') horizontal = true;
  @Output()
  notifyWillChangeSize: EventEmitter<boolean> = new EventEmitter<boolean>();
  @HostBinding('class.vertical')
  public get vertical(): boolean {
    return !this.horizontal;
  }
  @HostBinding('style.width')
  public get width(): string {
    if (this.horizontal) {
      return `inherit`;
    } else {
      return `${this.thickness}px`;
    }
  }
  @HostBinding('style.hight')
  public get height(): string {
    if (this.vertical) {
      return `inherit`;
    } else {
      return `${this.thickness}px`;
    }
  }

  constructor() {}

  @HostListener('mousedown')
  onMousedown(): void {
    this.notifyWillChangeSize.emit(true);
  }
}
