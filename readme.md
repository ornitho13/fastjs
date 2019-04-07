# fastJs
A jquery alternative library.

You know jQuery, then you know fastJs !

## Documentation
###on init
On init css classes are injected to HTML node tag :
* if browser is IE <= 11
```html
<html class="legacy ie">
```
* if browser is opera
```html
<html class="modern opera">
```
* if browser is firefox
```html
<html class="modern mozilla">
```
* if browsers are edge, safari or chrome
```html
<html class="modern weblit-edge-chrome">
```
* if browser is touch compatible
```html
<html class="touch modern webkit-edge-chrome">
```
There is a browsers object instanciated on fastJs initialization that can be used like this :
```js
console.log($.browsers)
// {
//      ie: false,
//      opera: false,
//      firefox: false,
//      legacy : false,
//      modern : false
// }
```
###assets loader :
```js
$.load([{
    url : 'styles/search/mvp-ui.css'
}], function(){}, 'ready');

/**
lazyload assets at the window.load event (could be 'ready')
then callback called
and a event is fired (custom or 'assetLoaded')
*/
$.load([
    {url : 'scripts/search/mvp-ui.js'}
], function () {
    console.log('callback - load asset finish');
}, 'load', 'loaded');
       
```
###Selector core :
####find(selector:string):
######return fastJs
```js
$('.main').find('.test')
```
####offset():
######return obj
```js
let offset = $('.main').offset();
console.log(offset.top, offset.left);
```
####position():
######return obj
```js
let position = $('.main').position();
console.log(position.top, position.left)
```
####children():
######return fastJs
```js
$('.main').children().each(function(item){
    //do stuff
});
```
####css(attribute|object:string|object, value:string):
######return fastJs|css value
```js
let $test = $('.test');
$test.css('background', '#ddd');
$test.css({background : '#000', color : '#fff'});
console.log($test.css('background'));
//#ddd
```
####each(function):
```js
$('.test').each(function(item){
    console.log(item.innerHTML);
})
```
####get(index:integer):
######return node
```js
$('.test').get(1); 
```
####next():
######return fastJs
```js
$('.test').next().get(0)
```
####previous():
######return fastJs
```js
$('.test').previous().get(0);
```
####siblings():
######return fastJs
```js
$('.test').siblings().each(function(){
    //do stuff
});
```
####closest(selector:string):
######return fastJs
```js
$('.test').closest('.main').get(0)
```
####parent():
######return fastJs
```js
$('.test').parent().html()
```
####scrollTop():
######return scrollTop
```js
$('.main').scrollTop();
$('.main').scrollTop(100)
```
###DOM Manipulation
####attr(attribute, value):
######return fastJs
```js
$('.main').attr('data-type');
$('.main').attr('data-type', 'progress')
```
####data(key, value):
######return string|fastJs
```js
$('.test').data('position');
$('.test').data('position', 10)
```
####append(string|node):
######return fastJs
```js
$('.test').append('<div>test2</div>')
let div = document.createElement('div');
div.innerHTML = 'test3';
$('.test').append(div);
```
####prepend(string|node):
######return fastJs
######
```js
$('.test').prepend('<div>test2</div>')
let div = document.createElement('div');
div.innerHTML = 'test3';
$('.test').prepend(div);
```
####before(string):
######return fastJs
######
```js
$('.test').before('<span>test2</span>')
```
####empty():
######no return
```js
$('.test').empty();
```
####remove():
######return fastJs
```js
$('.test').remove();
```
####html(string):
######return string|fastJs
```js
$('.test').html();
$('.test').html('test2');
```
####text(string):
######return string|fastJs
```js
$('.test').text();
$('.test').text('test2');
```
####replaceWith(string|node):
######return fastJs
```js
$('.test').replaceWith('<div>test2</div>')
```
###Events
####one(event, function):
###### 
```js
$('.test').one('click', function(){
    //do stuff
});
```
####on(event, function):
######
```js
$('.test').on('click', function(){
    //do stuff
});
```
####off(event, function):
######
```js
$('.test').off('click', addClick)
```
####trigger(event):
######
```js
$('.test').trigger('click');
```
###Class Manipulation
####addClass(string):
######return fastJs
```js
$('.test').addClass('test2')
```
####removeClass(string):
######return fastJs
```js
$('.test').removeClass('test2')
```
####toggleClass(string):
######return fastJs
```js
$('.test').toggleClass('test2')
```
####hasClass(string):
######return boolean
```js
if ($('.test').hasClass('test2')) {
    //do stuff
}
```
###Toolkit Core
####extend(originalObj, obj1 [, obj2, obj3, ...]):
######return fastJs
```js
$.extend(fastJs, {
    feature : function() {
        //stuff
    }
})
```
####ajax():
######
```js
$.ajax({
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
})
```
####event
######on, trigger
```js
$.on('load', window, function(){
    //do stuff
});
$.trigger(window, 'loaded');
```
####test and feature
######test(test, successFunction, failFunction)
######feature(feature, callback)
```js
$.feature('hasLocalStorage', function(){
    return window.localStorage;
});
if ($.hasLocalStorage) {
    //do stuff
}
let i = 100 > 1;
$.test(i, function(){
    //do success stuff
}, function(){
    //do failed stuff
});
```
### Utils
####parseJSON(jsonString):
###### return json object
```js
let obj = $.parseJSON('{"a":1}');
console.log(obj.a);
```
####stringify(value, replacer, space):
###### return string from json obj
```js
$.stringify({"a": 2});
```
####inArray(string, array):
######return 
```js
let data = $.inArray('fruit', ['fruit', 'vegetable']);
```
####isLitteralCompatible():
####### : is browser understand literal string format
######return boolean
```js
if ($.isLitteralCompatible()) {
    let test = `hi ${name}`
} else {
    let test = 'hi' + name;
}
```
####isString(anything):
######return boolean
```js
if ($.isString(data)) {
    // do stuff
}
```
####isNumber(anything):
######return boolean
```js
if ($.isNumber(data)) {
    // do stuff
}
```
####isArray(anything):
######return boolean
```js
if ($.isArray(data)) {
    // do stuff
}
```
####isFunction(anything):
######return boolean
```js
if ($.isFunction(data)) {
    // do stuff
}
```
####isObject(anything):
######return boolean
```js
if ($.isObject(data)) {
    // do stuff
}
```
####isNull(anything):
######return boolean
```js
if ($.isNull(data)) {
    // do stuff
}
```
####isUndefined(anything):
######return boolean
```js
if ($.isUndefined(data)) {
    // do stuff
}
```
####isBoolean(anything):
######return boolean
```js
if ($.isBoolean(data)) {
    // do stuff
}
```
####isDate(anything):
######return boolean
```js
if ($.isDate(data)) {
    // do stuff
}
```
####type(anything):
######return type of anything
```js
console.log($.type(data));
```
##Exemples :
```js
$('.main').find('.link').each(function(item) {
    console.log(item.innerHTML + ' vanilla')
})
 
$(window).on('loaded', function(){
    console.log('loaded finish')
})
        
console.log($('.test').offset())

$('.test').addClass('pouet').addClass('truc').removeClass('pouet');

if ($('.test').hasClass('truc')) {
    $('.test.truc').addClass('machin')
}

$('.test a').attr('href', '#!')

$('.test').append('<section style="background: #900; color: #fff">append html fragment</section>');

$('.test').prepend('<section style="background: #964; color: #fff">append html fragment</section>');

$('.no-link').before('<span>lala</span>');

var noLink = $('.test').clone();
console.log($(noLink).attr('class', 'new-class'));
$('.test').append(noLink)
$('.test').prepend(noLink);
$('.test').before(noLink);
console.log(noLink.children().html('hophopohp'))

$('.link-up').data('request', 'plop-data')
console.log($('.no-link').css({
    color : 'green',
    background: 'yellow'
}).css('font-size', '2rem').css('background'))

$('li a').get(1).innerHTML = 'ciblage fait';
$($('li a').get(2)).html('plop 3 to plop ').css('background', 'purple')
console.log($($('li').get(0)).next().css({'text-transform' : 'uppercase'}));

console.log($('li').parent().get(0));

$('#footer').remove();

$('#footer').replaceWith(noLink)
$('#footer').replaceWith('<p>it\'s a trap</p>')

$.ajax({
    url : '/data/search/data.json',
    dataType: 'json',
    done (response) {
        //console.log(response);
    }
});
```

test feature :
```js
let i = 0;

$.feature('isFeature', function(){
    return i === 0
})
console.log($.isFeature);

$.test($.isFeature, function(){
    console.log('success')
}, function(){
    console.log('failed')
});

console.log($('.link-up').data('request'));
console.log($('.test a.no-link').attr('class'));
```
# fastjs
