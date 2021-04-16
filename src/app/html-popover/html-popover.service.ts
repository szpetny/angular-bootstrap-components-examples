// original implementation https://github.com/tiagoroldao/angular2-tests/tree/master/demos/tooltip

import { Injectable} from '@angular/core';

declare let $: any;

interface PositionDescription {
    horizontal: string;
    vertical: string;
}

@Injectable({ providedIn: 'root' })
export class HtmlPopoverService {
    /**
     * Provides coordinates for the targetEl in relation to hostEl
     */
    positionElements(hostEl: any, targetEl: any, positionStr: string = 'top', appendToBody: any): {top: number; left: number} {
        const position = this.breakPositionString(positionStr);
        const hostElPos = appendToBody ? $(hostEl).offset() : $(hostEl).position();

        const shiftWidth: {[key: string]: any} = {
            center: () => hostElPos.left + ($(hostEl).width() / 2) - ($(targetEl).innerWidth() / 2),
            left: () => hostElPos.left - $(targetEl).innerWidth(),
            right: () => hostElPos.left + $(hostEl).width()
        };

        const shiftHeight: {[key: string]: any} = {
            center: (): number => hostElPos.top + ($(hostEl).height() / 2) - ($(targetEl).innerHeight() / 2),
            top: (): number => hostElPos.top - $(targetEl).innerHeight(),
            bottom: (): number => hostElPos.top + $(hostEl).height()
        };

        return {
            top: shiftHeight[position.vertical](),
            left: shiftWidth[position.horizontal]()
        };
    }

    private breakPositionString(positionStr: string): PositionDescription {
        const positionStrParts = positionStr.split('-');

        if (positionStrParts.length > 1) {
            return {
                horizontal: positionStrParts[0],
                vertical: positionStrParts[1]
            };
        } else if (positionStr === 'top' || positionStr === 'bottom') {
            return {
                horizontal: 'center',
                vertical: positionStr
            };
        } else if (positionStr === 'left' || positionStr === 'right') {
            return {
                horizontal: positionStr,
                vertical: 'center'
            };
        }
        return {
            horizontal: 'center',
            vertical: 'center'
        };
    }
}
