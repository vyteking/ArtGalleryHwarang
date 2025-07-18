import React, { useEffect } from 'react';
import localeloader from './localetextfiles/en.json' //English as temporarily
import {GetLocaleTexts} from './localeslist';

let currentLocale = localeloader;
let direction = currentLocale.LocaleInfo.direction;
let localeTxt = currentLocale.Texts;

// Function to load JSON locale files from `locale` folder
const LoadLocaleList = (r) => {
    let files = {};
    let localefolderpath = './localetextfiles/';
    r.Keys().forEach((itm) => {})
}

function SetLocale(selectedLocale) {
    currentLocale = GetLocaleTexts(selectedLocale);
}

export default {
    currentLocale, 
    SetLocale, 
    localeTxt, 
    direction,
}