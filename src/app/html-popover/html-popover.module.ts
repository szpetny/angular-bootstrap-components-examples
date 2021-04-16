import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlPopoverDirective } from './html-popover.directive';
import { HtmlPopoverComponent } from './html-popover.component';



@NgModule({
  declarations: [HtmlPopoverDirective, HtmlPopoverComponent],
  imports: [CommonModule],
  exports: [HtmlPopoverDirective, HtmlPopoverComponent]
})
export class HtmlPopoverModule { }
