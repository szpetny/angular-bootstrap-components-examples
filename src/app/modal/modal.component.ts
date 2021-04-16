import { Component, ViewEncapsulation, ElementRef,
         Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

declare let $: any;

@Component({
    selector: 'modal-comp',
    template: `
        <div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog {{sizingClass}}"
                [class.modal-dialog-centered]="verticallyCentered">
                <div class="modal-content" [class.transparent-modal-content]="transparentModal"
                     [style.min-height]="customMinHeight">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `,
    styles: [
        `.transparent-modal-content {
            background: none;
            border: none;
        }`
    ],
    encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
    @Input() staticBackdrop = false;
    @Input() verticallyCentered = true;
    @Input() sizingClass = ''; // modal-xl modal-lg modal-sm // none -> default
    @Input() transparentModal = false;
    @Input() customMinHeight = 'inherit';

    readonly afterClosed = new Subject();

    private element: any;

    constructor(private hostElement: ElementRef,
                private zone: NgZone) {
        this.element = hostElement.nativeElement;
    }

    ngOnInit() {
        const cmp = this;

        this.zone.runOutsideAngular(() => {
            $(this.element).on('click', el => {
                if (el.target.className.indexOf('modal') !== -1 && !this.staticBackdrop) {
                    this.zone.run(() => cmp.close());
                }
            });

            $('.modal').on('show.bs.modal', () => {
                const $modal = $(this);
                const baseZIndex = 1050;
                const modalZIndex = baseZIndex + ($('.modal.show').length * 20);
                $modal.css('z-index', modalZIndex).css('overflow', 'auto');
            });

            $('.modal').on('hide.bs.modal', () => {
                const $modal = $(this);
                $modal.css('z-index', '');
            });
        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            $(this.modalElement()).off();
            $(this.element).off();
        });
        this.afterClosed.complete();
        this.element.remove();
    }

    open() {
        this.zone.runOutsideAngular(() => {
            // display backdrop only for the first visible modal, don't show it for the stacked modal
            const backdrop = !($('.modal').length > 1);
            $(this.modalElement()).modal({
                backdrop: this.staticBackdrop ? 'static' : backdrop,
                keyboard: !this.staticBackdrop
            });
        });
    }

    close() {
        this.zone.runOutsideAngular(() => $(this.modalElement()).modal('hide'));
        this.afterClosed.next();
    }

    private modalElement() {
        return $('.modal')[$('.modal').length - 1];
    }
}
