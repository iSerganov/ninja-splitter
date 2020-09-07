import { Component, HostListener, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'ninja-separator',
  styleUrls: ['ninja-separator.component.scss'],
  template: `
    <div
      #invisibleExtension
      [hidden]="thickness >= 5"
      class="invisible-extension"></div>

    <div
        class="handle">
    </div>
  `,
  host: {
    '[style.width]': 'width',
    '[style.height]': 'height',
    '[class.horizontal]': 'horizontal',
    '[class.vertical]': '!horizontal',
  }
})
export class NinjaSeparatorComponent implements AfterViewInit {

  @Input() thickness: number;
  @Input() horizontal = true;
  @Output() notifyWillChangeSize: EventEmitter<boolean> = new EventEmitter<boolean>();

  public get width(): string {
    if (this.horizontal) {
      return `inherit`;
    } else {
      return `${this.thickness}px`;
    }
  }

  public get height(): string {
    if (!this.horizontal) {
      return `inherit`;
    } else {
      return `${this.thickness}px`;
    }
  }

  @ViewChild('invisibleExtension') invisibleExtension: ElementRef;

  constructor() { }

  @HostListener('mousedown')
  onMousedown(): void {
    this.notifyWillChangeSize.emit(true);
  }

  ngAfterViewInit(): void {
    this.invisibleExtension.nativeElement.style[this.horizontal ? 'top' : 'left'] =
      -(7 - this.thickness) / 2 + 'px';
  }
}
