(function(window){
    "use strict";

    let fastJs = function (selector) {
        return new fastJs.fonction.init(selector);
    };
    /**
     * fastjs selector core
     * type {{next: (function(): fastJs), parent: (function(): fastJs), css: css, data: data, before: (function(*=): fastJs), prepend: (function(*=): fastJs), remove: (function(): fastJs), empty: empty, children: (function(): fastJs), find: (function(*=): fastJs), get: get, makeArray(*): *, selector: Array, html: html, attr: attr, addClass: (function(*=): fastJs), on: on, selectorLength: number, init: (function(*=): fastJs), offset: (function(): {top: number, left: number}), previous: (function(): fastJs), removeClass: (function(*=): fastJs), one: one, hasClass: hasClass, parseHTML: (function(*): HTMLCollection), trigger: trigger, each(*): (*|undefined), scrollTop: (function(): number), off: off, filter: (function(*): fastJs), toggleClass(*=): void, clone: clone, position: (function(): {top: number, left: number}), triggerCustom: triggerCustom, append: (function(*=): fastJs), replaceWith: replaceWith}}
     */
    fastJs.fonction = fastJs.prototype = {
        selector : [],
        selectorLength : 0,
        makeArray (obj) {
            let array = [], len = obj.length, i = 0;
            for (; i < len; i++) {
                array[i] = obj[i];
            }

            return array;
        },

        /**
         * Enabling find sub selector of a seletor context
         * @example $$('h1').find('.test');
         * @param selector
         * @returns {fastJs}
         */
        find : function (selector) {
            let newSelector = [];
            if (typeof selector === 'string') {
                this.selector.forEach(element => {
                    element.querySelectorAll(selector).forEach(item => {
                        newSelector.push(item);
                    })
                });
                this.selectorLength = newSelector.length;
                this.selector = newSelector;
            }

            return this;
        },
        /**
         * return the offset coord from an element
         * @returns {{top: number, left: number}}
         */
        offset: function () { // 69% better than jQuery - IE8+
            let element = this.selector;
            if (this.selectorLength > 0) {
                element = this.selector[0];
            }

            let rect = element.getBoundingClientRect(), bodyElt = document.body;
            return {
                top: rect.top + bodyElt.scrollTop,
                left: rect.left + bodyElt.scrollLeft
            };
        },
        /**
         * get children from a html element
         * @returns {fastJs}
         */
        children: function () {
            let children = [];
            if (this.selectorLength > 0) {
                this.selector.forEach(element => {
                    let childs = element.childNodes;
                    if (childs.length > 0) {
                        childs.forEach(child => {
                            children.push(child);
                        })
                    }
                });
                this.selector = children;
                this.selectorLength = this.selector.length
            }

            return this;
        },
        /**
         * clone html element
         * @returns {*}
         */
        clone: function () { // a revoir
            if (this.selectorLength > 0) {
                return this.selector[0].cloneNode(true);
            } else {
                //error message
            }

            return this;
        },
        /**
         * get or set an css rule for a html element
         * @param key string|object
         * @param value
         * @returns {*}
         */
        css: function (key, value) {
            if (typeof value === 'undefined') {
                if (typeof key === 'object') {
                    this.selector.forEach(item => {
                        for (let property in key) {
                            item.style[property] = key[property];
                        }
                    });
                    return this;
                } else {
                    return getComputedStyle(this.selector[0])[key];
                }
            } else {
                //set
                this.selector.forEach(item => {
                    item.style[key] = value;
                });
                return this;
            }
        },
        /**
         * execute a callback for each html element in the fastJs scoped selector (only first element)
         * @param callback
         */
        each (callback) {
            if (this.selectorLength > 0) {
                return this.selector.forEach(element => {
                    (callback)(element)
                });
            }
        },
        /**
         * apply a filter to each html element
         * @param filterFn
         */
        filter: function (filterFn) { //@todo à revoir
            this.selector.forEach(element => {
                (filterFn)(element);
            });
            return this;
            //Array.prototype.filter.call(this.selector, filterFn);
        },
        /**
         * get to a specific index a html element (return javascript element)
         * @param index
         * @returns {*}
         */
        get: function (index) {
            if (typeof index === 'undefined') {
                return this.selector;
            } else {
                return this.selector[index];
            }
        },

        /**
         * get the next element sibling from a html element
         * @returns {fastJs}
         */
        next: function () {
            let element = this.selector[0];
            this.selector = [];
            this.selector[0] = element.nextElementSibling;
            this.selectorLength = 1;
            return this;
        },
        /**
         * get the previous element sibling from a html element
         * @returns {fastJs}
         */
        previous: function () {
            let element = this.selector[0];
            this.selector = [];
            this.selector[0] = element.previousElementSibling;
            this.selectorLength = 1;
            return this;
        },
        siblings () {
            let arr = [],
                currentSelector = this.selector[0];

            arr.filter.call(currentSelector.parentNode.children, child => {
                return child !== currentSelector;
            });
            this.selector = [];
            this.selector = arr;
            return this;
        },
        prototypeClosest (currentSelector, selector) {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
            }
            if (!document.documentElement.contains(currentSelector)) {
                return null;
            }
            do {
                if (currentSelector.matches(selector)) {
                    return currentSelector;
                }
                currentSelector = currentSelector.parentElement || currentSelector.parentNode;
            } while (currentSelector !== null && currentSelector.nodeType === 1);

            return null;
        },
        closest (selector) {
            if (!Element.prototype.closest) {
                let currentSelector = this.selector[0];

                let elts = this.prototypeClosest(currentSelector, selector);
                if (elts !== null && elts.length > 0) {
                    this.selector = [];
                    this.selector = elts;
                    this.selectorLength = elts.length;
                    return this;
                }
            } else {
                let closest = this.selector[0].closest(selector);
                this.selector = [];
                this.selector[0] = closest;
                this.selectorLength = 1;
            }

            return this;
        },
        /**
         * get the direct parent from a html element
         * @returns {fastJs}
         */
        parent: function () {
            if (this.selector[0].parentNode) {
                let selector = this.selector[0];
                this.selector = [];
                this.selector[0] = selector.parentNode;
                this.selectorLength = 1;
            }

            return this;
        },
        /**
         * get the current position of a html element
         * @returns {{top: (Number|number), left: (Number|number)}}
         */
        position: function () {
            let element = this.selector[0];
            return {
                top: element.offsetTop,
                left: element.offsetLeft
            };
        },
        /**
         * get body scrollTop
         * @returns {number}
         */
        scrollTop: function (number) {
            let element = this.selector[0];
            if (typeof number !== 'undefined') {
                element.scrollTop = number;
                return this;
            }
            return element.scrollTop;
        },
        /**
         * create a temporary html document
         * @param htmlString
         * @returns {HTMLCollection}
         */
        parseHTML: function (htmlString) {
            let temp = document.implementation.createHTMLDocument();
            temp.body.innerHTML = htmlString;
            return temp.body.children;
        }

    };
    let init = fastJs.fonction.init = function (selector) {
        if (typeof selector === 'string') {
            this.selector = document.querySelectorAll(selector);
            this.selectorLength = this.selector.length;
        }
        if (selector === window) {
            this.selector[0] = selector;
            this.selectorLength = 1;
        } else if (selector.nodeType && selector.nodeType > 0) {
            this.selector[0] = selector;
            this.selectorLength = 1;
        } else {
            if (Array.isArray(selector) === true) {
                this.selector = this.makeArray(selector);
                this.selectorLength = this.selector.length;
            }
        }

        return this;
    };
    init.prototype = fastJs.fonction;
    /**
     * extend object
     * @param out
     * @returns {*|{}}
     */
    fastJs.extend = fastJs.fonction.extend = function (out) {
        if (Object.prototype.assign) {
            //if (arguments.length === 2)
            {
                for (let i = 1; i < arguments.length; i++) {
                    if (!arguments[i]) {
                        continue;
                    }
                    Object.assign(out, arguments[i])
                }
            }
        } else {
            out = out || {};
            for (let i = 1; i < arguments.length; i++) {
                if (!arguments[i]) {
                    continue;
                }
                for (let key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        out[key] = arguments[i][key];
                    }
                }
            }

            return out;
        }
    };

    fastJs.fonction.init.prototype = fastJs.fonction;

    if (typeof window.fastJs === 'undefined') {
        window.fastJs = fastJs;
    }
    if (typeof window.$$ === 'undefined') {
        window.$$ = fastJs;
    }
    if (typeof window.$ === 'undefined') {
        window.$ = fastJs;
    }
})(window);
