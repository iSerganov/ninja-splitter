import { Component, ViewChild, ElementRef, HostListener, Input, Self } from '@angular/core';
import { NinjaSplitterComponent } from './ninja-splitter.component';
import { PositionService } from './position.service';

@Component({
  selector: 'horizontal-ninja',
  styles: [`.h-outer {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
  }

  .upper-component,
  .lower-component {
    height: calc(50% - 4px);
  }`],
  template: `
    <div
      #primaryComponent
      [hidden]="primaryToggledOff"
      class="upper-component">
      <ng-content select=".ninja-content-primary"></ng-content>
    </div>
    <ninja-separator
      #separator
      [hidden]="primaryToggledOff || secondaryToggledOff"
      [thickness]="separatorThickness"
      (notifyWillChangeSize)="notifyWillChangeSize($event)">
    </ninja-separator>
    <div
      #secondaryComponent
      [hidden]="secondaryToggledOff"
      class="lower-component">
      <ng-content select=".ninja-content-secondary"></ng-content>
    </div>
  `,
})
export class HorizontalNinjaSplitterComponent extends NinjaSplitterComponent {

  getPrimarySize(): number {
    return this.primaryComponent.nativeElement.offsetHeight;
  }

  getSecondarySize(): number {
    return this.secondaryComponent.nativeElement.offsetHeight;
  }

  dividerPosition(size: number): void {
    const sizePct = (size / this._self.nativeElement.offsetHeight) * 100.0;
    this.primaryComponent.nativeElement.style.height = sizePct + '%';
    this.secondaryComponent.nativeElement.style.height = `calc(${100 - sizePct}% -
          ${+!(this.primaryToggledOff || this.secondaryToggledOff) * this.separatorThickness}px)`;
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent): any {
    if (this.isResizing) {
      const coords = PositionService.offset(this.primaryComponent);
      this.applySizeChange(event.pageY - coords.top);
      return false;
    }
  }
}
