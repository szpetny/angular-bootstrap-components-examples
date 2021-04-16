import { Component, Input, OnInit } from '@angular/core';

@Component({
    templateUrl: './example-dialog.component.html',
})
export class ExampleDialogComponent {
    @Input() someInput1: string;
    @Input() someInput2: any;

    @Input() callbackOnClose: any;

    submit() {
        console.log('SUBMIT');
        this.callbackOnClose();
    }

    close() {
        console.log('CLOSE');
        this.callbackOnClose();
    }
}
