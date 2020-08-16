import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NinjaSplitterComponent } from './ninja-splitter.component';
import { PositionService } from './position.service';

@Component({
  selector: 'vertical-ninja',
  styleUrls: ['vertical-ninja.component.scss'],
  template: `
  <div #outer class="v-outer">
    <div
      #primaryComponent
      [hidden]="primaryToggledOff"
      class="left-component">
      <ng-content select=".ninja-content-primary"></ng-content>
    </div>
    <vertical-ninja-separator
      #separator
      [hidden]="primaryToggledOff || secondaryToggledOff"
      [thickness]="separatorThickness"
      (notifyWillChangeSize)="notifyWillChangeSize($event)">
    </vertical-ninja-separator>
    <div
      #secondaryComponent
      [hidden]="secondaryToggledOff"
      class="right-component">
      <ng-content select=".ninja-content-secondary"></ng-content>
    </div>
  </div>
  `,
})
export class VerticalNinjaSplitterComponent extends NinjaSplitterComponent {

  @ViewChild('outer', { static: true }) outerContainer: ElementRef;

  getTotalSize(): number {
    return this.outerContainer.nativeElement.offsetWidth;
  }

  getPrimarySize(): number {
    return this.primaryComponent.nativeElement.offsetWidth;
  }

  getSecondarySize(): number {
    return this.secondaryComponent.nativeElement.offsetWidth;
  }

  dividerPosition(size: number) {
    const sizePct = (size / this.getTotalSize()) * 100;
    this.primaryComponent.nativeElement.style.width = sizePct + '%';
    this.secondaryComponent.nativeElement.style.width =
      'calc(' + (100 - sizePct) + '% - ' +
      (this.primaryToggledOff || this.secondaryToggledOff ? 0 : this.separatorThickness) + 'px)';
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
      if (this.isResizing) {
        const coords = PositionService.offset(this.primaryComponent);
        this.applySizeChange(event.pageX - coords.left);
        return false;
      }
    }
}
