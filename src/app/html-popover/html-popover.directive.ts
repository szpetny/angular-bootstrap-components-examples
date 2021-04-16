// original implementation https://github.com/tiagoroldao/angular2-tests/tree/master/demos/tooltip

import { ElementRef, Directive, Input, NgZone, TemplateRef, OnInit, OnDestroy,
         ContentChild, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { HtmlPopoverComponent } from './html-popover.component';

declare let $: any;

@Directive({
  selector: '[htmlPopover]'
})
export class HtmlPopoverDirective implements OnInit, OnDestroy {
    @ContentChild('popoverTemplate') private popoverTemplate: TemplateRef<any>;
    @Input() private appendToBody = true;
    @Input() private placement = 'left';

    private htmlPopover: ComponentRef<HtmlPopoverComponent>;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainer: ViewContainerRef,
        private hostElement: ElementRef,
        private zone: NgZone) {}

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            $(this.hostElement.nativeElement).on('mouseenter mouseover', () => {
                this.zone.run(() => {
                    if (!this.htmlPopover && this.popoverTemplate) {
                        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HtmlPopoverComponent);
                        this.htmlPopover = this.viewContainer.createComponent(componentFactory);
                        this.htmlPopover.instance.placement = this.placement;
                        this.htmlPopover.instance.content = this.popoverTemplate;
                        this.htmlPopover.instance.parentEl = this.hostElement;
                        this.htmlPopover.instance.appendToBody = this.appendToBody;
                    }
                });
            });

            $(this.hostElement.nativeElement).on('mouseout mouseleave', () => {
                this.zone.run(() => {
                    this.hidePopover();
                });
            });
        });
    }
    ngOnDestroy() {
        this.hidePopover();
        this.zone.runOutsideAngular(() => $(this.hostElement.nativeElement).off());
    }

    private hidePopover() {
        if (this.htmlPopover) {
            this.htmlPopover.destroy();
            this.htmlPopover = undefined;
        }
    }

}
