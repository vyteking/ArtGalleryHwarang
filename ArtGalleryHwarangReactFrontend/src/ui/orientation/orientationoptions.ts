import './orientationstyles.css'

export type Direction = 0 | 1 | 2 | 3;
export type OrientationClass = 'ltr-ttb' | 'rtl-ttb' | 'ttb-ltr' | 'ttb-rtl';

export function isSupportingVerticalText(direction: Direction): boolean {
    return direction === 2 || direction === 3;
}

export function getDir(direction: Direction, isVertical: boolean): OrientationClass {
    if (isSupportingVerticalText(direction) && isVertical) {
        switch (direction) {
            case 2: return 'ttb-ltr';
            case 3: return 'ttb-rtl';
            default: return 'ltr-ttb';
        }
    }
    switch (direction) {
        case 0:
        case 3: return 'ltr-ttb';
        case 1:
        case 2: return 'rtl-ttb';
        default: return 'ltr-ttb';
    }
}
