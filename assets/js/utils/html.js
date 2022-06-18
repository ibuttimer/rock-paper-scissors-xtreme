/**
    HTML generator functions.
    @author Ian Buttimer
*/
import { accumulator } from './utils.js';

/**
 * Wrap a div element around the specified html.
 * @param {string} tag - tag name of element
 * @param {string|Array[string]} className - name of class(es) to give div
 * @param {string|Array[string]} innerHTML - html to wrap.
 *                 Note: To display a value that evaluates to falsy, e.g. 0, first convert it to a string.
 * @param {object} attribs - object of attributes; keys and values
 * @returns {string} html for wrapped entity
 */
const htmlWrapper = (tag, className, innerHtml, attribs = {}, selfClosing = false) => {
    const attribString = Object.entries(attribs)
        .map(([key, value]) => `${key}="${value}" `)
        .reduce(accumulator, '');
        if (Array.isArray(className)) {
            className = className.join(' ');    // aggregate classes
        }
        if (Array.isArray(innerHtml)) {
            innerHtml = innerHtml.join(' ');    // aggregate innerHtml
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
 * Generate a table element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlTable = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('table', className, innerHtml, attribs, false);
};

/**
 * Generate a table head element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlThead = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('thead', className, innerHtml, attribs, false);
};

/**
 * Generate a table body element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlTbody = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('tbody', className, innerHtml, attribs, false);
};

/**
 * Generate a table row element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlTr = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('tr', className, innerHtml, attribs, false);
};

/**
 * Generate a table header element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlTh = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('th', className, innerHtml, attribs, false);
};

/**
 * Generate a table data element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlTd = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('td', className, innerHtml, attribs, false);
};

/**
 * Generate a span element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlSpan = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('span', className, innerHtml, attribs, false);
};

/**
 * Generate a paragraph element.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlP = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('p', className, innerHtml, attribs, false);
};

/**
 * Generate an Emphasis element paragraph element; 
 * "The <em> element is for words that have a stressed emphasis compared to surrounding text".
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em}
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlEm = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('em', className, innerHtml, attribs, false);
};

/**
 * Generate an Idiomatic Text element paragraph element;
 * "The <i> HTML element represents a range of text that is set off from the normal text for some reason, 
 * such as idiomatic text, technical terms, taxonomical designations, among others."
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i}
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlI = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('i', className, innerHtml, attribs, false);
};

/**
 * Generate a Bring Attention To element paragraph element;
 * "The <b> HTML element is used to draw the reader's attention to the element's contents, 
 * which are not otherwise granted special importance."
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b}
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlB = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('b', className, innerHtml, attribs, false);
};

/**
 * Generate a Strong Importance element paragraph element;
 * "The <strong> HTML element indicates that its contents have strong importance, seriousness, or urgency."
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong}
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlStrong = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('strong', className, innerHtml, attribs, false);
};

/**
 * Generate a section element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlSection = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('section', className, innerHtml, attribs, false);
};

/**
 * Generate an article element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlArticle = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('article', className, innerHtml, attribs, false);
};

/**
 * Generate an aside element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlAside = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('aside', className, innerHtml, attribs, false);
};

/**
 * Generate an input element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlInput = (className, attribs = {}) => {
    return htmlWrapper('input', className, null, attribs, true);
};

/**
 * Generate a label element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlLabel = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('label', className, innerHtml, attribs, false);
};

/**
 * Generate an anchor element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlA = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('a', className, innerHtml, attribs, false);
};

/**
 * Generate an list item element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlLi = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('li', className, innerHtml, attribs, false);
};

/**
 * Generate an unordered list element containing the specified html.
 * @returns {string} - html for element
 * @see {@link htmlWrapper}
 */
 export const htmlUl = (className, innerHtml, attribs = {}) => {
    return htmlWrapper('ul', className, innerHtml, attribs, false);
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
