import React, { useEffect } from 'react';
// import localeloader from '.locale'
import localeloader from './locale/en.json' //English as temporarily
// import textorientationfile from './ui/orientation/'
// import textorientationfile from './ui/orientation/0_LRTB.css'//Left-to-right-top-to-bottom temporarily

const currentLocale = localeloader;
const textorientation = currentLocale.LocaleInfo.direction;
const localeTxt = currentLocale.Texts;
const isSupportingVerticalText = false;
const isVertical = false;

// Function to load JSON locale files from `locale` folder
const LoadLocaleList = (r) => {
    let files = {};
    let localefolderpath = './locale/';
    r.Keys().forEach((itm) => {})
}

function SetLocale(selectedLocale) {
    let localefilepath = './locale/'+selectedLocale+".json";
    currentLocale = localefilepath;
}

// Function to synchronize the locale files as the file `localetemplate.json`
function SyncLocaleFile() {

}

// Function to load CSS files dynamically
const loadStyles = () => {
  const context = require.context('./ui/orientation', false, /\.css$/);
  context.keys().forEach((fileName) => {
    const style = context(fileName);
    // You can also log or manipulate the loaded styles if needed
    console.log(`Loaded style: ${fileName}`);
  });
};

const GetTextorentation = () => {
    let filename = "./ui/orientation";
    isSupportingVerticalText = (textorientation & 2) === 1;
    if (isSupportingVerticalText && isVertical) {
        switch (textorientation) {
            case 2:
                filename += "2_TBLR.css";
                break;
            case 3:
                filename += "3_TBRL.css";
                break;
        }
    }
    else {
        switch (textorientation) {
            case 0:
            case 3:
                //isSupportingVerticalText = false;
                filename += "0_LRTB.css";
                break;
            case 1:
            case 2:
                //isSupportingVerticalText = false;
                filename += "1_RLTB.css";
                break;
        }
    }
    return filename;
}

function SwitchVerticalMode(setVertical) {
    if (isSupportingVerticalText) isVertical = setVertical;
}

export default {
    currentLocale, 
    localeTxt, 
    GetTextorentation, 
    SwitchVerticalMode,
}