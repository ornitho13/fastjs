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
;/**
 * dom manipulation part
 */
(function(window){
    /**
     * get or set an attribute from a html element
     * @param attr
     * @param value
     * @returns {string}
     */
    fastJs.prototype.attr = function (attr, value) { // 50% to 60% better than jQuery
        if (typeof value === 'undefined') {
            let element = this.selector;
            if (this.selectorLength > 0) {
                element = this.selector[0];
                return element.getAttribute(attr);
            }
        } else {
            this.selector.forEach(item => {
                item.setAttribute(attr, value);
            });
        }

        return this;
    }
    /**
     * get or set data attribute from a html element
     * @param key
     * @param value
     * @returns {*}
     */
    fastJs.prototype.data = function (key, value) {
        if (typeof value === 'undefined') {
            let element = this.selector;
            if (this.selectorLength > 0) {
                element = this.selector[0];
                return element.dataset[key];
            }
        } else {
            this.selector.forEach(item => {
                item.dataset[key] = value;
            });
            return this;
        }
    }
    /**
     * append child to a html element
     * @param elts
     * @returns {fastJs}
     */
    fastJs.prototype.append = function (elts) {
        let eltLength = 0, self = this, elt;
        if (elts.nodeType && elts.nodeType > 0) {
            elts = elts.outerHTML;
        }
        this.selector.forEach(item => {
            if (typeof elts === 'string') {
                elt = self.parseHTML(elts);
                eltLength = elt.length;
            } else {
                elt[0] = elts;
            }
            while (eltLength > 0) {
                let element = elt[0];
                item.appendChild(element);
                eltLength = elt.length;
            }
        });
        return this;
    }
    /**
     * prepend a node to the current fastJs scoped html element
     * @param elts
     */
    fastJs.prototype.prepend = function (elts) { //92% better than jquery =>
        let eltLength = 0,
            self = this;
        if (elts.nodeType && elts.nodeType > 0) {
            elts = elts.outerHTML;
        }

        this.selector.forEach(item => {
            let elt;
            if (typeof elts === 'string') {
                elt = self.parseHTML(elts);
            } else {
                elt = [];
                elt[0] = elts;
            }

            eltLength = elt.length;
            while (eltLength > 0) {
                let element = elt[eltLength - 1];
                item.insertBefore(element, item.firstChild);
                eltLength = elt.length;
            }
        });

        return this;
    }
    /**
     * insert htmlstring to a html element
     * @param htmlString
     * @returns {fastJs}
     */
    fastJs.prototype.before = function (htmlString) { // 75% better than jQuery
        if (htmlString.nodeType && htmlString.nodeType > 0) {
            htmlString = htmlString.outerHTML;
        }

        this.selector.forEach(item => {
            item.insertAdjacentHTML('beforebegin', htmlString);

        });

        return this;
    }
    /**
     * set each html scoped element innerHTML to empty
     */
    fastJs.prototype.empty = function () {
        this.selector.forEach(item => {
            item.innerHTML = '';
        });
    }
    /**
     * set or get innertHTML from a html element
     * @param htmlString
     * @returns {string|*|Object|string|string|string}
     */
    fastJs.prototype.html = function (htmlString) {
        if (typeof htmlString !== 'undefined') {
            this.selector.forEach(item => {
                item.innerHTML = htmlString;
            });
            return this;
        } else {
            return this.selector[0].innerHTML;
        }
    }
    fastJs.prototype.text = function (str) {
        if (typeof str !== 'undefined') {
            this.selector.forEach(item => {
                item.textContent = str;
            });
            return this;
        } else {
            return this.selector[0].textContent;
        }
    }
    /**
     * remove a html element
     */
    fastJs.prototype.remove = function () {
        this.selector.forEach(item => {
            item.parentNode.removeChild(item);
        });
        return this;
    }
    /**
     * replace the current fastJs scoped html elements by a html string
     * @param htmlString
     * @returns {fastJs}
     */
    fastJs.prototype.replaceWith = function (htmlString) {
        htmlString = htmlString.nodeType && htmlString.nodeType > 0 ? htmlString.outerHTML : htmlString;

        this.selector.forEach(item => {
            item.outerHTML = htmlString;
        });

        return this;
    }
})(window);
;/**
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
;/**
 * classname manipulation part
 */
(function(window){
    /**
     * add class to the scoped selectors
     * @param className
     * @returns {fastJs}
     */
    fastJs.prototype.addClass =  function (className) { //94% better than jQuery
        let self = this;
        this.selector.forEach(item => {
            if (!self.hasClass(className, item)) {
                if (item.classList) {
                    item.classList.add(className);
                } else {
                    item.className += ' ' + className;
                }
            }
        });

        return this;
    }
    fastJs.prototype.toggleClass = function (className) {
        let self = this;
        this.selector.forEach(item => {
            if (item.classList && item.classList.toggle) {
                item.classList.toggle(className);
            } else {
                if (self.hasClass(className, item)) {
                    item.className = item.className.replace(
                        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi')
                        , ' '
                    );
                } else {
                    item.className += ' ' + className;
                }
            }
        });
    }
    /**
     * remove className to the scoped selectors
     * @param className
     * @returns {fastJs}
     */
    fastJs.prototype.removeClass = function (className) {
        let self = this;
        this.selector.forEach(item => {
            if (self.hasClass(className, item)) {
                if (item.classList) {
                    item.classList.remove(className);
                } else {
                    item.className = item.className.replace(
                        new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi')
                        , ' '
                    );
                }
            }
        });

        return this;
    }
    /**
     * return if a className exist for an element
     * @param className
     * @param item
     * @returns {boolean}
     */
    fastJs.prototype.hasClass = function (className, item) { //92% better than jQuery
        let element;
        if (typeof item !== 'undefined') {
            element = item;
        } else {
            element = this.selector;
            if (this.selectorLength > 0) {
                element = this.selector[0];
            }
        }
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }
})(window);/**
 * @param window
 * @param window.DocumentTouch
 * @param window.fastJs
 * @param window.opera
 * @param window.chrome
 * @param window.Mozilla
 */
(function(window){
    if (typeof window.fastJs === 'undefined') {
        throw 'Need selector-core.js module'
    } else {
        /**
         * fastJs toolkit core
         */
        fastJs.extend(fastJs, {
            browsers : {
                ie: false,
                edge : false,
                webkit: false,
                opera: false,
                firefox: false,
                version: false,
                chrome: false,
                legacy : false,
                modern : false
            },
            headTag : null,
            isTouchDevice: false,
            /**
             * initialize the fastJs toolkit part
             */
            initialize () {
                let version = '';
                if (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch) {
                    version += ' touch';
                    this.isTouchDevice = true;
                }
                if ((document.all && document.addEventListener) || !!window.MSStream) { // ie 9 - 11
                    this.browsers.ie = true;
                    this.browser.legacy = true;
                    version += ' legacy ie';
                } else {
                    this.browsers.modern = true;
                    version += ' modern';
                    if (!!window.opera) {
                        this.browsers.opera = true;
                        version += ' opera';
                    } else if (!!window.chrome) {
                        this.browsers.chrome = true;
                        this.browsers.webkit = true;
                        version += ' webkit-edge-chrome';
                    } else if (!!window.Mozilla) {
                        this.browsers.firefox = true;
                        version += ' mozilla';
                    }
                }
                this.headTag = document.getElementsByTagName('head')[0];
                document.getElementsByTagName('html')[0].className = version;

                return this;
            },
            /**
             * sanitize option for load
             * @param {string} url
             * @param {object} options
             */
            prepareOptions (url, options) {
                options.type = options.type ? options.type : (/\.css/.test(url) ? 'css' : 'js');
                options.async = options.async && typeof options.async === 'boolean' ? options.async : false;
                options.nodeType = options.type === 'css' ? 'link' : 'script';
                options.media = options.media ? options.media : 'all';
                return options
            },
            /**
             * prepare asset node elt
             * @param {string} url
             * @param {object} options
             */
            prepareElt (url, options) {
                let elt = document.createElement(options.nodeType);
                switch (options.type) {
                    case 'js':
                        elt.src = url;
                        elt.type = 'text/javascript';
                        elt.async = options.async;
                        break;
                    case 'css':
                        elt.href = url;
                        elt.rel = 'stylesheet';
                        elt.media = options.media;
                        elt.type = 'text/css';
                        break;
                    default:
                        elt.type = options.type;
                }

                return elt;
            },
            /**
             * loading file via Promise
             * @param {string} url
             * @param {object} options
             */
            modernLoad (url, options) {
                let self = this;
                return new Promise(function(resolve, reject) {
                    options = options || {};
                    self.prepareOptions(url, options);
                    if (typeof url !== 'string') {
                        reject({
                            message: 'url must be a string property'
                        })
                    }

                    let elt = self.prepareElt(url, options);
                    elt.onload = function () {
                        resolve({
                            url : url,
                            options : options,
                            elt : elt
                        });
                    };
                    elt.onerror = function () {
                        reject({
                            message : 'error on url loading',
                            url : url,
                            options : options,
                            elt : elt
                        })
                    };
                    self.headTag.appendChild(elt);
                })
            },
            /**
             * loading file for IE
             * @param {array} urlsArray
             * @param {string | event} eventCallback
             * @param {function} callback
             */
            legacyLoad (urlsArray, eventCallback, callback) {
                let item = urlsArray.shift(),
                    url = item.url,
                    options = {},
                    self = this;

                if (typeof url !== 'string') {
                    throw new Error('incorrect url type (need a string valid ressource url');
                }

                this.prepareOptions(url, options);
                let elt = self.prepareElt(url, options);

                elt.onload = function () {
                    if (urlsArray.length === 0) {
                        if (callback) {
                            callback();
                        }

                        self.trigger(window, eventCallback);
                    } else {
                        self.legacyLoad(urlsArray, eventCallback, callback);
                    }
                };
                elt.onerror = function () {
                    throw 'failed to load ' + url;
                };
                this.headTag.appendChild(elt);
                return this;
            },
            /**
             * load assets/files, ... via Promise or old way (IE)
             * @returns {fastJs}
             * @param urlsArray
             * @param callback
             * @param event
             * @param eventCallback
             * @global window
             */
            load (urlsArray, callback, event, eventCallback) {
                let element = document,
                    self = this;
                if (typeof event === 'undefined' || event === 'load') {
                    event = 'load';
                    // noinspection
                    element = window;
                }
                if (event === 'ready') {
                    event = 'DOMContentLoaded';
                }
                if (!eventCallback) {
                    eventCallback = 'assetLoaded';
                }
                if (Array.isArray(urlsArray) === false) {
                    throw 'You need to use an array of object => [{url => path.to.asset}]'
                }

                this.on(event, element, function(){
                    let currentLoad = [];

                    if (self.browsers.legacy) {
                        self.legacyLoad(urlsArray, eventCallback, callback);
                    } else {
                        urlsArray.forEach(item => {
                            //promise
                            currentLoad.push(self.modernLoad(item.url, item.options).then(resource => {
                                return resource;
                            }));
                        });
                        Promise.all(currentLoad).then(function(){
                            callback();
                            self.trigger(window, eventCallback)
                        }).catch(error => {

                        })
                    }
                });

                return this;
            },
            /**
             * to use after load fn, enabling to launch a callback after all url loaded
             * @param callback
             */
            finish (callback) {
                callback();
            }
        });

        fastJs.initialize();
    }
})(window);
;/**
 * @param window.fastJs
 */
(function(window){
    /**
     * utils part
     */
    if (typeof window.fastJs === 'undefined') {
        throw 'Need selector-core.js module';
    } else {
        fastJs.extend(fastJs, {
            parseJSON(data, reviser) {
                if (typeof data.trim !== 'undefined') {
                    data = data.trim();
                }
                if (window.JSON && window.JSON.parse) {
                    return window.JSON.parse(data, reviser);
                } else {
                    throw new Error('JSON.parse no native support');
                }
            },
            stringify(value, replacer, space) {
                try {
                    return window.JSON.stringify(value, replacer, space);
                } catch (e) {
                    throw new Error('JSON.stringify no native support');
                }
            },
            inArray(find, arr) {
                if (!Array.prototype.includes) { // IE<=11
                    return arr.indexOf(find) > -1;
                } else {
                    return arr.includes(find);
                }
            },
            isLitteralCompatible() {
                return !!Array.prototype.includes;
            },
            isString(str) {
                return typeof str === 'string' && str instanceof String;
            },
            isNumber(num) {
                return typeof num === 'number' && isFinite(num);
            },
            isArray(arr) {
                if (Array.prototype.isArray) {
                    return Array.isArray(arr);
                } else {
                    return typeof arr === 'object' && arr.constructor === Array;
                }
            },
            isFunction(fn) {
                return typeof fn === 'function';
            },
            isObject(obj) {
                return typeof obj === 'object' && Array.isArray(obj) === false;
            },
            isNull(val) {
                return val === null;
            },
            isUndefined(val) {
                return typeof val === 'undefined';
            },
            isBoolean(val) {
                return typeof val === 'boolean';
            },
            isDate(val) {
                return val instanceof Date;
            },
            type (val) {
                Object.prototype.toString.call(val).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
            }
        });
    }
})(window);
;(function(window){
    if (typeof window.fastJs === 'undefined') {
        throw 'Need selector-core.js module'
    } else {
        /**
         * event part
         */
        fastJs.extend(fastJs, {
            /**
             * event array for olders browsers
             */
            events: [],
            /**
             * add event listener to an element
             * @param element
             * @param event
             * @param callback
             */
            on: function (event, element, callback) {
                if (element !== null) {
                    if (element.addEventListener) {
                        element.addEventListener(event, callback, false);
                    } else {
                        throw 'IE9 + compatible'
                    }
                }
            },
            /**
             * trigger an event for a specific element
             * @param element
             * @param eventName
             */
            trigger: function (element, eventName) {
                /**
                 var event;
                 if (window.CustomEvent) {
                event = new CustomEvent(eventName, data);
                //event = new Event(eventName, data);
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
                //event.initEvent(event, true, true, data)
            }

                 this.event.render = new Event('render');
                 if ((document.all && document.addEventListener) || !!window.MSStream) { // ie 9 - 11
                this.event.render = document.createEvent('Event');
                this.event.render.initEvent('render', true, true);
            }
                 */
                let evt = new Event(eventName);

                if ((document.all && document.addEventListener) || !!window.MSStream) { // ie 9 - 11
                    evt = document.createEvent('HTMLEvents');
                    evt.initEvent(eventName, true, true);
                }

                //evt.eventName = eventName;
                if (element.dispatchEvent) {
                    element.dispatchEvent(evt);
                } else {
                    throw 'IE9 + compatible';
                }
            }
        });
    }
})(window);
;(function(window){
    if (typeof window.fastJs === 'undefined') {
        throw 'Need selector-core.js module'
    } else {
        /**
         * ajax part
         */
        fastJs.extend(fastJs, {
            /**
             * enabling xmlHttpRequest
             * example :
             EasJs.ajax({
                url : 'test.xml',
                dataType : 'xml',
                method : 'GET',
                cache : false,
                data : {
                    'test' : 'test'
                },
                done : function(response){
                    //console.log(response);
                },
                fail : function(xhr, status, errorResponse) {
                    console.log(xhr, status, errorResponse);
                },
                complete : function() {
                    //console.log('ajax finish');
                }
            });
             * @param options.fail
             * @param options.url
             * @param options.method
             * @param options.cache
             * @param options.data object
             * @param options.dataType
             * @param options.complete
             * @param options.done
             * @param options
             */
            ajax (options) {
                if (typeof options.url === 'undefined') {
                    throw new Error('need url');
                }
                if (typeof options.method === 'undefined') {
                    options.method = 'GET';
                }
                if (typeof options.cache === 'undefined' || !options.cache) {
                    options.url += '?_=' + new Date().getTime();
                    options.cache = false;
                } else {
                    options.cache = true;
                }
                if (typeof options.dataType === 'undefined') {
                    options.dataType = 'html';
                }
                if (typeof options.data !== 'undefined') {
                    //parseData
                    let data = '';
                    if (typeof options.data === 'object') {

                        for (let prop in options.data) {
                            if (options.data.hasOwnProperty(prop)) {
                                data += '&' + prop + '=' + options.data[prop];
                            }
                        }
                        if (options.cache === true) {
                            data = data.replace(/^&/, '?');
                        }
                    } else {
                        data = !options.cache ? '&' + options.data : options.data;
                    }
                    if (options.method === 'GET') {
                        options.url += data;
                    }
                    if (options.method !== 'GET') {
                        options.data = data.replace(/^\?/, '');
                    }
                }
                if (window.fetch) {
                    let myHeaders = new Headers();
                    switch (options.dataType) {
                        case 'xml' :
                            myHeaders.append('Content-Type', 'application/xml; charset=UTF-8');
                            break;
                        case 'json' :
                            myHeaders.append('Content-Type', 'application/json; charset=UTF-8');
                            break;
                        case 'html':
                            myHeaders.append('Content-Type', 'text/html; charset=UTF-8');
                            break;
                        case 'javascript' :
                            myHeaders.append('Content-Type', 'text/javascript; charset=UTF-8');
                            break;
                        default :
                            myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                            break;
                    }

                    let config = {
                        method: options.method,
                        headers: myHeaders,
                        cache: options.cache ? 'true' : 'default'
                    }
                    //@todo convert data object to url query for HEAD and GET method
                    if (options.data && (options.method !== 'GET' && options.method !== 'HEAD')) {
                        config.body = options.data;
                    }

                    fetch(options.url, config).then(response => {
                        if (response.ok) {
                            let contentType = response.headers.get('content-type');
                            if (contentType) {
                                switch (options.dataType) {
                                    case 'xml' :
                                        if (contentType.indexOf('application/xml') > -1 || contentType.indexOf('text/xml') > -1) {
                                            response.text().then(text => {
                                                let parser = new DOMParser();
                                                    let doc = parser.parseFromString(text, 'application/xml');
                                                    options.done(doc)
                                            })
                                        }

                                        break;
                                    case 'json' :
                                        if (contentType.indexOf('application/json') > -1) {
                                            response.json().then(json => {
                                                options.done(json);
                                            })
                                        }

                                        break;
                                    case 'javascript' :
                                        let script = document.createElement('script');
                                        script.innerText = this.responseText;
                                        document.getElementsByTagName('head')[0].appendChild(script);
                                        response = {
                                            ok : true,
                                            message : 'script loaded'
                                        }
                                        options.done(message);

                                        break;
                                    case 'html':
                                        if (contentType.indexOf('text/html') > -1) {
                                            response.text().then(text => {
                                                let tmp = document.implementation.createHTMLDocument();
                                                tmp.body.innerHTML = text;
                                                /*tmp.body.childNodes.forEeach(elt => {
                                                    dataHTML.push(elt);
                                                })*/

                                                /*let fragment = document.createDocumentFragment(),
                                                html = document.createElement('div');
                                                html.innerHTML = text;
                                                response = fragment.appendChild(html);
                                                options.done(response);*/
                                                options.done(tmp.body.innerHTML);
                                            })
                                        }

                                        break;
                                    default :
                                        response.text().then(text => {
                                            options.done(text);
                                        })
                                        break;
                                }
                            } else {
                                options.fail({ko : true, message: 'contentType error', data: response})
                            }
                        } else {
                            options.fail({ko : true, message: 'response status error', data: response})
                        }
                    }).catch(error => {
                        if (typeof options.fail === 'function') {
                            options.fail(error);
                        }
                    });
                    //exit;
                } else {
                    let request = new XMLHttpRequest();
                    request.open(options.method, options.url, true);
                    switch (options.dataType) {
                        case 'xml' :
                            request.setRequestHeader('Content-Type', 'application/xml; charset=UTF-8');
                            break;
                        case 'json' :
                            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                            break;
                        case 'html':
                            request.setRequestHeader('Content-Type', 'text/html; charset=UTF-8');
                            break;
                        case 'javascript' :
                            request.setRequestHeader('Content-Type', 'text/javascript; charset=UTF-8');
                            break;
                        default :
                            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                            break;
                    }

                    request.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            let response = this.response;
                            if (this.status === 200 && this.status < 400) {
                                if (typeof options.done === 'function') {
                                    switch (options.dataType) {
                                        case 'xml' :
                                            response = this.responseXML;
                                            break;
                                        case 'json' :
                                            if (window.JSON && window.JSON.parse) {
                                                response = window.JSON.parse(this.response, function(){});
                                            } else {
                                                response = this.response;
                                            }

                                            break;
                                        case 'javascript' :
                                            let script = document.createElement('script');
                                            script.innerText = this.responseText;
                                            document.getElementsByTagName('head')[0].appendChild(script);
                                            break;
                                        case 'html':
                                            /*let fragment = document.createDocumentFragment(),
                                                html = document.createElement('div');
                                            html.innerHTML = this.response;
                                            response = fragment.appendChild(html);*/

                                            let tmp = document.implementation.createHTMLDocument();
                                                tmp.body.innerHTML = this.response;
                                            response = tmp.body.innerHTML
                                            break;

                                    }
                                    console.log("test ajax", response)
                                    options.done(response);
                                }
                            } else {
                                //error
                                if (typeof options.fail === 'function') {
                                    options.fail(this, this.status, this.response);
                                }
                            }
                            //complete
                            if (typeof options.complete !== 'undefined' && typeof options.complete === 'function') {
                                options.complete()
                            }
                        }
                    };

                    if (typeof options.data === 'undefined' || options.method === 'GET') {
                        request.send();
                    } else {
                        request.send(options.data);
                    }
                }
            }
        });
    }
})(window);
;(function(window){
    if (typeof window.fastJs === 'undefined') {
        throw 'Need selector-core.js module'
    } else {
        /**
         * test and feature part
         */
        fastJs.extend(fastJs, {
            /**
             * test an instruction
             * @param testInstruction
             * @param successCallback
             * @param failedCallback
             */
            test: function (testInstruction, successCallback, failedCallback) {
                if ((testInstruction)) {
                    successCallback();
                } else {
                    failedCallback();
                }
            },
            /**
             * add feature to fastJs
             * @param feature
             * @param callback
             */
            feature: function (feature, callback) {
                this[feature] = callback();
            },
        });
    }
})(window);
