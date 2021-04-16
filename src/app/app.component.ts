import { Component, ViewChild, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalService } from './modal/modal.service';
import { ExampleDialogComponent } from './example-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private modalService: ModalService) {}

    //dropdown-search
    dropdownSearchInputName = "dropdownSearchInputName1";
    dropdownSearchInputId = "dropdownSearchInputId1";
    dropdownSearchInputLabel = "Dropdown Search Input Lbl";
    dropdownSearchInputPlaceholder = "Dropdown Search Input Placeholder";
    dropdownSearchValidationPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-z]{2,6}$/;
    dropdownSearchInputOptions = [
        {
            id: 1,
            prop1: 'prop1',
            email: 'gacek@ggg.cx'
        },
        {
            id: 2,
            prop1: 'prop2',
            email: 'wacek@ggg.cx'
        },
        {
            id: 3,
            prop1: 'prop3',
            email: 'placek@ggg.cx'
        }
    ];
    dropdownSearchInputOptionsSearch = new BehaviorSubject([]);
    dropdownSearchErrorMessage = "Expecting full email";
    dropdownSearchMaxResults = 2;

    dropdownSearchValueSubmitted(event) {
        console.log('dropdown search - value submitted');
        this.dropdownSearchInputOptionsSearch.next(this.dropdownSearchInputOptions);
    }
    dropdownSearchValueSelected(val) {
        this.dropdownSearchInputOptionsSearch.next([]);
        console.log('dropdown search - value selected ' + val);
    }
    dropdownSearchOnBlur(empty) {
        console.log('dropdown search - on blur');
        if (empty) {
            this.dropdownSearchInputOptionsSearch.next([]);
        }
    }

    //modal
    showModal1() {
        const importantHedgehog = {
            spikes: 101
        };
        this.modalService.openModal(ExampleDialogComponent,
            {
                sizingClass: 'modal-xl',
                staticBackdrop: true,
                verticallyCentered: false
            },
            {
                someInput1: 'This is a hedgehog',
                someInput2: importantHedgehog,

                callbackOnClose: () => this.modalService.closeModal()
            });
    }

    @ViewChild('exampleDialogTemplate', { read: TemplateRef }) exampleDialogTemplate: TemplateRef<any>;
    showModal2() {
        this.modalService.openModal(this.exampleDialogTemplate,
            {
                sizingClass: 'modal-sm',
                staticBackdrop: true,
                verticallyCentered: false
            });
    }
    submit1() {
        console.log('Submit modal created from template');
        this.modalService.closeModal();
    }
    close1() {
        console.log('Close modal created from template');
        this.modalService.closeModal();
    }

    //multiselect
    resetMultiselectS = new BehaviorSubject<boolean>(false);
    multiselectsSecretOptions = [
        {
            name: 'Grr',
            label: 'Rrg'
        },
        {
            name: 'Xrr',
            label: 'Rrx'
        },
        {
            name: 'Wrr',
            label: 'Rrw'
        }
    ];
    multiselectUpdatesSomething(event) {
        console.log('MULTISELECT UPDATE');
    }
    resetMultiselect() {
        this.resetMultiselectS.next(true);
    }

    //popover
    popoverVals = [
        {
            band: 'Prodigy',
            magnitude: 'loud'
        },
        {
            band: 'Vader',
            magnitude: 'louder'
        }
    ]
}
