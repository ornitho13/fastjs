/**
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
