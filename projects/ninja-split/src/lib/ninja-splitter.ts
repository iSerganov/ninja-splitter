import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalNinjaSplitterComponent } from './horizontal-ninja.component';
import { VerticalNinjaSplitterComponent } from './vertical-ninja.component';
import { NinjaSeparatorComponent } from './ninja-separator.component';
import { NinjaSplitterComponent } from './ninja-splitter.component';

export function delayedInit(): ModuleWithProviders<NinjaSplitterModule> {
  return {
    ngModule: NinjaSplitterModule,
    providers: []
  };
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    HorizontalNinjaSplitterComponent,
    VerticalNinjaSplitterComponent,
    NinjaSeparatorComponent,
    NinjaSplitterComponent
  ],
  exports: [HorizontalNinjaSplitterComponent, VerticalNinjaSplitterComponent]
})
export class NinjaSplitterModule {
  static forRoot = delayedInit();
}
