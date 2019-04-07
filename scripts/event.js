(function(window){
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
