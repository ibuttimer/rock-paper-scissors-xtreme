/**
    HTML generator functions.
    @author Ian Buttimer
*/
import { accumulator } from './utils.js';

/**
 * Wrap a div element around the specified html.
 * @param {string} tag - tag name of element
 * @param {string|Array[string]} className - name of class(es) to give div
 * @param {string} innerHTML - html to wrap
 * @param {object} attribs - object of attributes; keys and values
 * @returns {string} html for wrapped entity
 */
const htmlWrapper = (tag, className, innerHtml, attribs = {}, selfClosing = false) => {
    const attribString = Object.entries(attribs)
        .map(([key, value]) => `${key}="${value}" `)
        .reduce(accumulator, '');
    if (Array.isArray(className)) {
        className = className.join(' ');
    }
    return `<${tag} class="${className}" ${attribString} ${selfClosing ? '/' : ''}>
                ${selfClosing ? '' : `${innerHtml}
            </${tag}>`}        
    `;
};

/**
 * Wrap a div element around the specified html.
 * @returns {string} - html for wrapped entity
 * @see {@link htmlWrapper}
 */
export const htmlButton = (className, innerHtml, attribs = {}, selfClosing = false) => {
    return htmlWrapper('button', className, innerHtml, attribs, selfClosing);
};

/**
 * Generate a div element containing the specified html.
 * @returns {string} - html for wrapped entity
 * @see {@link htmlWrapper}
 */
export const htmlDiv = (className, innerHtml, attribs = {}, selfClosing = false) => {
    return htmlWrapper('div', className, innerHtml, attribs, selfClosing);
};

export default htmlWrapper;
