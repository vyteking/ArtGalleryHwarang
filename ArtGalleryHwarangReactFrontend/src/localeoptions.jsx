import React, { useEffect } from 'react';
import localeloader from './locale/en.json' //English as temporarily

let currentLocale = localeloader;
let direction = currentLocale.LocaleInfo.direction;
let localeTxt = currentLocale.Texts;

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

export default {
    currentLocale, 
    SetLocale, 
    localeTxt, 
    direction,
}