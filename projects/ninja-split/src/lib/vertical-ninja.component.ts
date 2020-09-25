import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NinjaSplitterComponent } from './ninja-splitter.component';
import { PositionService } from './position.service';

@Component({
  selector: 'vertical-ninja',
  styles: [`:host {
    height: 100%;
    width: 100%;
    display: flex;
  }

  .left-component {
    width: calc(50% - 4px);
  }

  .right-component {
    width: calc(50% - 4px);
  }`],
  template: `
    <div
      #primaryComponent
      [hidden]="primaryToggledOff"
      class="left-component">
      <ng-content select=".ninja-content-primary"></ng-content>
    </div>
    <ninja-separator
      [horizontal]="false"
      #separator
      [hidden]="primaryToggledOff || secondaryToggledOff"
      [thickness]="separatorThickness"
      (notifyWillChangeSize)="notifyWillChangeSize($event)">
    </ninja-separator>
    <div
      #secondaryComponent
      [hidden]="secondaryToggledOff"
      class="right-component">
      <ng-content select=".ninja-content-secondary"></ng-content>
    </div>
  `,
})
export class VerticalNinjaSplitterComponent extends NinjaSplitterComponent {

  @ViewChild('outer', { static: true }) outerContainer: ElementRef;

  getPrimarySize(): number {
    return this.primaryComponent.nativeElement.offsetWidth;
  }

  getSecondarySize(): number {
    return this.secondaryComponent.nativeElement.offsetWidth;
  }

  dividerPosition(size: number): void {
    const sizePct = (size / this._self.nativeElement[this.sizePropertyName]) * 100;
    this.primaryComponent.nativeElement.style.width = sizePct + '%';
    this.secondaryComponent.nativeElement.style.width =
      'calc(' + (100 - sizePct) + '% - ' +
      (this.primaryToggledOff || this.secondaryToggledOff ? 0 : this.separatorThickness) + 'px)';
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent): void {
    if (this.isResizing) {
      const coords = PositionService.offset(this.primaryComponent);
      this.applySizeChange(event.pageX - coords.left);
    }
  }
}
