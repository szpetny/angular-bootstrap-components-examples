// angular
import { Component, OnDestroy, AfterViewInit, NgZone, OnChanges,
         Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare let $: any;

@Component({
    selector: 'multiselect',
    template: `
        <select [id]="multiselectId" class="selectpicker mr-1" multiple data-style-base="btn btn-sm"
            data-width="6rem"
            [attr.data-none-selected-text]="placeholder"
            [disabled]="isDisabled">
            <ng-container *ngFor="let opt of allOptions">
                <ng-container *ngIf="optionTemplate">
                    <ng-container *ngTemplateOutlet="optionTemplate; context: {params: templateBasicContext, option: opt}"></ng-container>
                </ng-container>
                <option *ngIf="!optionTemplate" [value]="valueProp ? opt[valueProp] : opt">
                     {{labelProp ? opt[labelProp] : opt}}
                </option>
            </ng-container>
        </select>
    `
})

export class MultiselectComponent implements OnDestroy, AfterViewInit, OnChanges {
    @Input() multiselectId: string;
    @Input() allOptions: any[];
    @Input() selectedOptions: any[];
    @Input() isDisabled: boolean;
    @Input() placeholder: string;
    @Input() optionTemplate: TemplateRef<any>;
    @Input() templateBasicContext: any = {};
    @Input() valueProp: string;
    @Input() labelProp: string;
    @Input() reset: Observable<boolean>;
    @Output() updateSelected = new EventEmitter<any>();

    private componentDestroyed = new Subject();

    constructor(private zone: NgZone) {}

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            if (this.selectedOptions) {
                const vals = this.selectedOptions.map(selOpt => {
                    const found = this.allOptions.find(opt => {
                        if (this.valueProp) {
                            return opt[this.valueProp] === selOpt;
                        } else {
                            return opt === selOpt;
                        }
                    });
                    if (found) {
                        return this.valueProp ? found[this.valueProp] : found;
                    }
                });
                $('#' + this.multiselectId).selectpicker('val', vals);
            } else {
                $('#' + this.multiselectId).selectpicker();
            }
            $('#' + this.multiselectId).on('changed.bs.select', (event, clickedIndex, isSelected, previousValue) => {
                if (clickedIndex !== null) {
                    const selectedOptions = [];
                    for (const eventTargetOption of event.target.options) {
                        if (eventTargetOption.selected) {
                            selectedOptions.push(eventTargetOption.value);
                        }
                    }
                    this.updateSelected.emit({id: this.multiselectId, value: selectedOptions});
                }
            });

        });
    }

    ngOnChanges() {
        if (this.reset) {
            this.reset.pipe(takeUntil(this.componentDestroyed)).subscribe(res => {
                if (res) {
                    this.zone.runOutsideAngular(() => $('#' + this.multiselectId).selectpicker('deselectAll'));
                }
            });
        }
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => $('#' + this.multiselectId).off());
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }
}
