(function(window){
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
