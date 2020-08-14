import { Component, OnInit } from '@angular/core';
import { NinjaSeparatorComponent } from './ninja-separator.component'

@Component({
  selector: 'vertical-ninja-separator',
  styleUrls: ['vertical-ninja-separator.component.scss'],
  template: `
    <div
      #invisibleExtension
      [hidden]="thickness >= 7"
      class="invisible-extension"></div>

    <div class="handle"></div>
  `,
  host: {
    '[style.width.px]': 'thickness'
  }
})
export class VerticalNinjaSeparatorComponent
  extends NinjaSeparatorComponent
  implements OnInit {

  ngAfterViewInit() {
    this.invisibleExtension.nativeElement.style.left =
      -(5 - this.thickness) / 2 + "px";
  }
}
