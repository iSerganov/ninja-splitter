import { Component, OnInit } from '@angular/core';
import { NinjaSeparatorComponent } from './ninja-separator.component';

@Component({
  selector: 'horizontal-ninja-separator',
  styleUrls: ['horizontal-ninja-separator.component.scss'],
  template: `
    <div
      #invisibleExtension
      [hidden]="thickness >= 5"
      class="invisible-extension"></div>

    <div class="handle"></div>
  `,
  host: {
    '[style.height.px]': 'thickness'
  }
})
export class HorizontalNinjaSeparatorComponent
  extends NinjaSeparatorComponent
  implements OnInit {

  ngAfterViewInit() {
    this.invisibleExtension.nativeElement.style.top =
      -(5 - this.thickness) / 2 + "px";
  }

}
