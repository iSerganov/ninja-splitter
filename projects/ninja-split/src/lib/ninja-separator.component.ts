import { Component, OnInit, HostListener, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  template: ''
})
export class NinjaSeparatorComponent implements OnInit {

  @Input() thickness: number;
  @Output() notifyWillChangeSize: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('invisibleExtension') invisibleExtension: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    this.notifyWillChangeSize.emit(true);
    return false;
  }
}
