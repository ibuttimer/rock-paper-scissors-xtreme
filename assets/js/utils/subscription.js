/**
 * Class representing a subscription which listeners can register with to receive updates.
 * @author Ian Buttimer
 */
export default class Subscription {

    listeners = [];

    /**
     * Add a listener
     * @param {function} listener - listener to add
     * @returns {boolean} true if listener added, otherwise false
     */
    registerListener(listener) {
        let modified = false;
        if (!this.isRegistered(listener)) {
            this.listeners.push(listener);
            modified = true;
        }
        return modified;
    }

    /**
     * Check if listener is registered
     * @param {function} listener - listener to check
     * @returns {boolean} true if listener is registered, otherwise false
     */
    isRegistered(listener) {
        return this.listeners.find(x => x === listener) !== undefined;
    }

    /**
     * Remove a listener
     * @param {function} listener - listener to remove
     * @returns {boolean} true if listener removed, otherwise false
     */
     unregisterListener(listener) {
        let modified = false;
        let index = this.listeners.findIndex(x => x === listener);
        if (index > 0) {
            this.listeners.splice(index, 1);
            modified = true;
        }
        return modified;
    }

    /**
     * Remove all listeners
     * @returns {boolean} true if listener removed, otherwise false
     */
     unregisterAll() {
        const modified = this.listeners.length > 0;
        this.listeners = [];
        return modified;
    }

    /**
     * Notify listeners
     * @param  {...any} args - arguments to pass to listeners
     */
    notifyListeners(...args) {
        this.listeners.forEach(listener => listener(...args));
    }
}