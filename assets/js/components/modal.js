import { log } from '../globals.js';
import { accumulator } from '../utils/index.js';

export const MODAL_YES = 'yes';
export const MODAL_NO = 'no';

/**
 * Display a modal dialogue
 * @param {string} label - modal identifier label
 * @param {string} content - model html content
 * @param {Array[object]} buttons - array of {@link modalButton} parameter object(s)
 * @returns {Modal} tingle modal instance
 */
export default function showModal(label, content, buttons = []) {
    // instantiate new modal
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: [/*'custom-class-1', 'custom-class-2'*/],
        onOpen: function() {
            log(`${label} modal open`);
        },
        onClose: function() {
            log(`${label} modal close`);
        },
        beforeClose: function() {
            // here's goes some logic
            // e.g. save content before closing the modal
            return true; // close the modal
            return false; // nothing happens
        }
    });

    // set content
    modal.setContent(content);

    // add buttons
    buttons.forEach(button => {
        modal.addFooterBtn(button.text, button.classes, function() {
            button.onClick(button.value, button.context);
            modal.close();
        });
    });

    // open modal
    modal.open();

    return modal;
}

/**
 * Display a Yes/No modal dialogue
 * @param {string} label - modal identifier label
 * @param {string} content - model html content
 * @param {function} callback - function with the following signature
 *                              onClick(value: any, context: any)
 *                             to call when buttons clicked
 * @param {any} context - optional context
 * @returns {Modal} tingle modal instance
 */
export function showYesNoModal(label, content, callback, context) {
    // instantiate new modal
    const buttonBase = 'tingle-btn btn__tingle '
    return showModal(label, content, [
        modalButton('Yes', buttonBase + 'btn__tingle-yes', callback, MODAL_YES, context),
        modalButton('No', buttonBase + 'btn__tingle-no', callback, MODAL_NO, context)
    ]);
}

/**
 * Generate a modal button parameter object
 * @param {string} text - button text
 * @param {string|Array[string]} classes - css class(es) for button
 * @param {function} onClick - function with the following signature
 *                              onClick(value: any, context: any)
 *                             to call when button clicked
 * @param {any} value - value associated with button
 * @param {any} context - optional context
 * @returns {object} parameter object
 */
export function modalButton(text, classes, onClick, value, context) {
    return {
        text: text, 
        classes: Array.isArray(classes) ? classes.reduce(accumulator, '') : classes, 
        onClick: onClick,
        value: value,
        context: context
    }
}