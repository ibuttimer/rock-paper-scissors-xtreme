export { default as Subscription } from './subscription.js'
export { 
    variableCheck, requiredVariable, gameParticipantsCheck, mapToString, 
    getVariantInfo as getVariantInfo, generateId, optionsList, accumulator,
    addElementClass, removeElementClass, replaceElementClass, delay,
    adjustArray 
} from './utils.js'
export { 
    htmlDiv, htmlButton, htmlImg, htmlH1, htmlH2, htmlH3, htmlH4, htmlH5, htmlH6,
    htmlTable, htmlThead, htmlTbody, htmlTr, htmlTh, htmlTd, htmlSpan, htmlP,
    htmlSection, htmlAside, htmlInput, htmlLabel 
} from './html.js'
export { loadPreferences, savePreferences } from './storage.js'