/* eslint-disable prefer-arrow-callback, no-var, no-tabs */
var delay = 500;

setTimeout(function(){
    var script = document.createElement('script');
    script.src = '/javascripts/myscript-final.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('body')[0].appendChild(script);
}, delay);
