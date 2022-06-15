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
                ${selfClosing ? '' : `${innerHtml ? innerHtml : ''}
            </${tag}>`}`;
};

/**
 * Generate a h1 element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlH1 = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('h1', className, innerHtml, attribs, false);
};

/**
 * Generate a h2 element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlH2 = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('h2', className, innerHtml, attribs, false);
};

/**
 * Generate a h3 element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlH3 = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('h3', className, innerHtml, attribs, false);
};

/**
 * Generate a h4 element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlH4 = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('h4', className, innerHtml, attribs, false);
};

/**
 * Generate a h5 element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlH5 = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('h5', className, innerHtml, attribs, false);
};

/**
 * Generate a h6 element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlH6 = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('h6', className, innerHtml, attribs, false);
};

/**
 * Generate an image element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlImg = (className, attribs = {}) => {
    return htmlWrapper('img', className, null, attribs, true);
};

/**
 * Generate a button element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlButton = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('button', className, innerHtml, attribs, false);
};

/**
 * Generate a div element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
export const htmlDiv = (className, innerHtml, attribs = {}, selfClosing = false) => {
    return htmlWrapper('div', className, innerHtml, attribs, selfClosing);
};

export default htmlWrapper;
