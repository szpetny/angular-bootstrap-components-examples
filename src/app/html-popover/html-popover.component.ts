// original implementation https://github.com/tiagoroldao/angular2-tests/tree/master/demos/tooltip

import { ElementRef, Component, Input, AfterViewInit, TemplateRef, OnDestroy, NgZone } from '@angular/core';
import { HtmlPopoverService } from './html-popover.service';

declare let $: any;

@Component({
   selector: 'html-popover',
   template: `<div class="inner"><template [ngTemplateOutlet]="content"></template></div><div class="arrow"></div>`,
   styleUrls: ['./html-popover.component.css']
})
export class HtmlPopoverComponent implements AfterViewInit, OnDestroy {
    @Input() content: TemplateRef<any>;
    @Input() parentEl: ElementRef;
    @Input() placement: string;
    @Input() appendToBody: boolean;

    constructor(private htmlPopoverService: HtmlPopoverService,
                 private hostElement: ElementRef,
                 private zone: NgZone) {}

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            const position = this.htmlPopoverService.positionElements(
                this.parentEl.nativeElement,
                this.hostElement.nativeElement,
                this.placement,
                this.appendToBody);

                $(this.hostElement.nativeElement).css({
                    top: position.top + 'px',
                    left: position.left + 'px',
                    display: 'block',
                });
        });
    }

    ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            $(this.hostElement.nativeElement).remove();
        });
    }
}
