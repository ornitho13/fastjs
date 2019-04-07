/**
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
