/**
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
