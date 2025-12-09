import './orientationstyles.css'

export function isSupportingVerticalText(direction) {
    return direction === 2 || direction === 3;
}

export function getDir(direction, isVertical) {
    let dir;
    if (isSupportingVerticalText(direction) && isVertical) {
        switch (direction) {
            case 2:
                dir = 'ttb-ltr';
                break;
            case 3:
                dir = 'ttb-rtl';
                break;
            default:
                dir = 'ltr-ttb';
                break;
        }
    }
    else {
        switch (direction) {
            case 0:
            case 3:
                dir = 'ltr-ttb';
                break;
            case 1:
            case 2:
                dir = 'rtl-ttb';
                break;
            default:
                dir = 'ltr-ttb';
                break;
        }
    }
    return dir;
}
