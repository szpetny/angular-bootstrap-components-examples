import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DropdownSearchModule } from './dropdown-search/dropdown-search.module';
import { HtmlPopoverModule } from './html-popover/html-popover.module';
import { ModalModule } from './modal/modal.module';
import { MultiselectModule } from './multiselect/multiselect.module';
import { ExampleDialogComponent } from './example-dialog.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DropdownSearchModule,
    HtmlPopoverModule,
    ModalModule,
    MultiselectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ExampleDialogComponent]
})
export class AppModule { }
