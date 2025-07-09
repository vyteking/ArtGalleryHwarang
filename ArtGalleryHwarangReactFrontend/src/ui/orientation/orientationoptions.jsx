import './orientationstyles.css'

let isSupportingVerticalText;
let isVertical;

export function GetDir(direction) {
    isSupportingVerticalText = (direction & 2) === 1;
    let dir;
    if (isSupportingVerticalText && isVertical) {
        switch (direction) {
            case 2:
                dir = 'ttb-ltr';
                break;
            case 3:
                dir = 'ttb-rtl';
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
        }
    }
    return dir;
}

function SwitchVerticalMode(setVertical) {
    if (isSupportingVerticalText) isVertical = setVertical;
}

export default {
    SwitchVerticalMode
}