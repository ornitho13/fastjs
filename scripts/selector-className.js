/**
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
})(window)