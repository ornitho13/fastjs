(function(window){
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
