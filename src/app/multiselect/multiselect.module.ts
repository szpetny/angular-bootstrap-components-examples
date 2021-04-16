import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiselectComponent } from './multiselect.component';



@NgModule({
  declarations: [MultiselectComponent],
  imports: [CommonModule],
  exports: [MultiselectComponent]
})
export class MultiselectModule { }
