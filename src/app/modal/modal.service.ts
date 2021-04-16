import { Injectable, ComponentRef, ComponentFactoryResolver,
         ApplicationRef, Injector, Inject,
         TemplateRef, EmbeddedViewRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ModalComponent } from './modal.component';

class ModalEntity {
    modalComponentRef: ComponentRef<ModalComponent>;
    ngContentComponentViewRef: ComponentRef<any>;
    ngContentViewRef: EmbeddedViewRef<any>;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
    modalsArray: ModalEntity[] = [];
    tmpModalEntity: ModalEntity;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private appRef: ApplicationRef,
                private injector: Injector,
                @Inject(DOCUMENT) private document: any) {}

    openModal(contentToResolve: any, modalOptions?: any, context?: any) {
        this.tmpModalEntity = new ModalEntity();
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
        const content = this.resolveContent(contentToResolve, context);

        this.tmpModalEntity.modalComponentRef = componentFactory.create(this.injector, content);
        if (modalOptions) {
            Object.keys(modalOptions).forEach(key => this.tmpModalEntity.modalComponentRef.instance[key] = modalOptions[key]);
        }
        this.appRef.attachView(this.tmpModalEntity.modalComponentRef.hostView);

        const {nativeElement} = this.tmpModalEntity.modalComponentRef.location;
        this.document.body.appendChild(nativeElement);

        this.modalsArray.push(this.tmpModalEntity);

        const sub = this.tmpModalEntity.modalComponentRef.instance.afterClosed.asObservable()
            .subscribe(_ => {
                this.removeFromBody();
                sub.unsubscribe();
            });

        this.tmpModalEntity.modalComponentRef.instance.open();
    }

    removeFromBody() {
        const modalEntityToRemove = this.modalsArray.pop();
        if (modalEntityToRemove.ngContentComponentViewRef) {
            this.appRef.detachView(modalEntityToRemove.ngContentComponentViewRef.hostView);
            modalEntityToRemove.ngContentComponentViewRef.destroy();
        }
        if (modalEntityToRemove.ngContentViewRef) {
            this.appRef.detachView(modalEntityToRemove.ngContentViewRef);
            modalEntityToRemove.ngContentViewRef.destroy();
        }
        this.appRef.detachView(modalEntityToRemove.modalComponentRef.hostView);
        modalEntityToRemove.modalComponentRef.destroy();
    }

    closeModal() {
        this.modalsArray[this.modalsArray.length - 1].modalComponentRef.instance.close();
    }

    private resolveContent(content: any, context?: any): any[][] {
        if (!content) {
            return;
        }
        // template
        if (content instanceof TemplateRef) {
            this.tmpModalEntity.ngContentViewRef = content.createEmbeddedView(context);
            this.appRef.attachView(this.tmpModalEntity.ngContentViewRef);
            return [this.tmpModalEntity.ngContentViewRef.rootNodes];
        }

        // template for component content
        if (content && context instanceof TemplateRef) {
            this.tmpModalEntity.ngContentViewRef = context.createEmbeddedView(undefined);
            this.appRef.attachView(this.tmpModalEntity.ngContentViewRef);
        }

        // component
        const factory = this.componentFactoryResolver.resolveComponentFactory(content);
        this.tmpModalEntity.ngContentComponentViewRef = factory.create(this.injector,
                this.tmpModalEntity.ngContentViewRef ? [this.tmpModalEntity.ngContentViewRef.rootNodes] : undefined);
        if (context) {
            Object.keys(context).forEach(key => this.tmpModalEntity.ngContentComponentViewRef.instance[key] = context[key]);
        }
        this.appRef.attachView(this.tmpModalEntity.ngContentComponentViewRef.hostView);
        return [[this.tmpModalEntity.ngContentComponentViewRef.location.nativeElement]];
    }
}
