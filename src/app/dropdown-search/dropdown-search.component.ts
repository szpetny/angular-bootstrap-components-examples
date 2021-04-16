import { Component, Input, HostListener, Output, OnChanges,
         ViewChild, EventEmitter, ElementRef, TemplateRef } from '@angular/core';

@Component({
    selector: 'dropdown-search',
    templateUrl: './dropdown-search.component.html',
    styles: [
        `.template-wrapper:not(:empty) + .default {
            display: none;
        }`
    ]
})
export class DropdownSearchComponent implements OnChanges {
    @Input() searchInputName: string;
    @Input() searchInputId: string;
    @Input() searchInputLabel: string;
    @Input() searchInputPlaceholder: string;
    @Input() validationPattern: RegExp;
    @Input() inputOptions: any[];
    @Input() optionsFilter: any;
    @Input() errorMessage: string;
    @Input() maxResults = -1;
    @Input() optionTemplate: TemplateRef<any>;
    @Output() valueSubmitted = new EventEmitter();
    @Output() valueSelected = new EventEmitter();
    @Output() doBlur = new EventEmitter();
    @ViewChild('searchInput') searchInput: ElementRef;

    options: any[];
    inputValue: string;
    displayError = false;
    displayNoResultsMessage = false;

    @HostListener('keyup', ['$event'])
    onKeyup(event) {
        this.displayError = false;
        this.displayNoResultsMessage = false;
        if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {// esc
            this.searchInput.nativeElement.blur();
            this.doBlur.emit(true);
        } else {
            this.searchInput.nativeElement.focus();
            this.inputValue = this.searchInput.nativeElement.value.trim();
            if (this.optionsFilter) {
                if (this.inputValue) {
                    this.options = this.optionsFilter(this.inputOptions, this.inputValue);
                } else {
                    this.options = undefined;
                }
                if (this.inputValue && (!this.options || this.options.length === 0)) {
                    this.displayNoResultsMessage = true;
                }
            } else if (this.validationPattern && this.inputValue) {
                if (this.validationPattern && this.validationPattern.test(this.inputValue)) {
                    this.valueSubmitted.emit(this.inputValue);
                } else {
                    this.displayError = true;
                }
            }
        }
    }

    ngOnChanges() {
        this.displayError = false;
        this.displayNoResultsMessage = false;
        if (!this.optionsFilter) {
            this.options = this.inputOptions;
        }
        this.displayNoResultsMessage = this.inputValue && (!this.inputOptions || this.inputOptions.length === 0);
    }

    selectOption(value: any) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.searchInput.nativeElement.focus();
        if (value) {
            this.searchInput.nativeElement.value = '';
            if (this.optionsFilter) {
                this.options = undefined;
            }
            this.valueSelected.emit(value);
        }
    }
}
