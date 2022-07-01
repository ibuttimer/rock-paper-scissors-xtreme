import { requiredVariable } from './index.js'

/**
 * Class representing details for a view
 * @author Ian Buttimer
 */
 export class ViewDetail {

    /**
     * Html for the view.
     * @type {string}
     */
    html;
    /**
     * MutationObserver to observe the main element
     * @type {MutationObserver}
     */
    observer;
    /**
     * Options for the observer @see {@link https://dom.spec.whatwg.org/#dictdef-mutationobserverinit}
     * @type {object}
     */
    observerOptions;
    /**
     * Settings change listener with prototype
     * 
     *  listener(property: @type {string}, value: @type {boolean})
     * @type {function}
     */
    settingListener;
    /**
     * Setter of view-specific event handlers with prototype
     *
     *  setter(gameState: @type {GameState})
     * @type {function}
     */
    eventHandlerSetter;

    /**
     * @constructor
     * @param {string} html - enum name.
     */
    constructor(html) {
        // sanity checks
        requiredVariable(html, 'html');
        this.html = html;
        this.setObserver(null);
        this.settingListener = null;
        this.eventHandlerSetter = null;
    }

    /**
     * Builder function to set mutation observer and options
     * @param {MutationObserver} observer - MutationObserver to observe the main element
     * @param {object} observerOptions - options for the observer 
     * @return {ViewDetail} this object
     * @see {@link https://dom.spec.whatwg.org/#dictdef-mutationobserverinit}
     */
    setObserver(observer, observerOptions = null) {
        this.observer = observer;
        this.observerOptions = observerOptions;
        return this;
    }

    /**
     * Builder function to set the settings change listener
     * @param {function} listener - settings change listener with prototype
     * 
     *  listener(property: @type {string}, value: @type {boolean})
     * 
     * @return {ViewDetail} this object
     */
    setSettingListener(listener) {
        this.settingListener = listener;
        return this;
    }

    /**
     * Builder function to set the view-specific event handlers
     * @param {function} setter - view-specific event handlers with prototype
     * 
     *  setter(gameState: @type {GameState})
     * 
     * @return {ViewDetail} this object
     */
    setEventHandlerSetter(setter) {
        this.eventHandlerSetter = setter;
        return this;
    }
}