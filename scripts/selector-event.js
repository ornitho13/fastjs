/**
 * dom event for selected Elements
 */
(function(window){
    /**
     * add event listener once
     * @param {string} eventName
     * @param {function} callback
     */
    fastJs.prototype.one = function (eventName, callback) {
        this.selector.forEach(item => {
            item.addEventListener(eventName, function (event) {
                (callback)(event);
                if (typeof callback === 'undefined') {
                    this.removeEventListener(eventName);
                } else {
                    this.removeEventListener(eventName, callback);
                }
            });
        });
    }
    /**
     * add event listener
     * @param {string} eventName
     * @param {function} callback
     */
    fastJs.prototype.on = function (eventName, callback) {
        this.selector.forEach(item => {
            item.addEventListener(eventName, callback);
        });
    }
    /**
     * remove event listener
     * @param {string} eventName
     * @param {function} callback
     */
    fastJs.prototype.off = function (eventName, callback) {
        this.selector.forEach(item => {
            if (typeof callback === 'undefined') {
                item.removeEventListener(eventName);
            } else {
                item.removeEventListener(eventName, callback);
            }
        });
    }
    /**
     * trigger event
     * @param {string} eventName
     */
    fastJs.prototype.trigger = function (eventName) {
        let event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, false);
        this.selector.forEach(element => {
            element.dispatchEvent(event);
        });
    }
    /**
     * trigger custom event
     * @param {string} eventName
     * @param {*} data
     */
    fastJs.prototype.triggerCustom = function (eventName, data) {
        let event;
        if (window.CustomEvent) {
            event = new CustomEvent(eventName, data);
            //event = new Event(eventName, data);
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
            //event.initEvent(event, true, true, data)
        }

        this.selector.forEach(element => {
            element.dispatchEvent(event);
        });
    }
})(window);
