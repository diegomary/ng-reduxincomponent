import "babel-polyfill";
import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;
import angular from 'angular';
import 'underscore';
window.$ = window.jQuery = jQuery;
jQuery.noConflict(true);

 import app from './components/statecomponent';

$(() => {

  // function Es6AjaxGet(url) {
  //     return new Promise(function(resolve, reject) {
  //         let req = new XMLHttpRequest();
  //         req.open("GET", url);
  //         req.setRequestHeader ("Accept", "text/json");  
  //         req.onload = () => {
  //             if (req.status === 200) {
  //                 resolve(req.response);
  //             } else {
  //                 reject(new Error(req.statusText));
  //             }
  //         };
  //         req.onerror = () => {
  //             reject(new Error("Network error"));
  //         };
  //         req.send();
  //     });
  // }
  //
  // Es6AjaxGet('https://dmm888enhanced.apphb.com/api/apicode/getflowers')
  //     .then(JSON.parse)
  //     .then((r) => console.log(r,'--------ES6PROMISE POLYFILLED'))
  //     .catch(function(error) { throw new ApplicationError(error); });

});
