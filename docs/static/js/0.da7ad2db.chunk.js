webpackJsonp([0],{58:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=n(60),r=n(0),o=(n.n(r),n(64)),i=n(69),l=(n.n(i),function(t){function e(e){var n=t.call(this,e)||this;return n.state={},n}return a.b(e,t),e.prototype.render=function(){var t=this.props,e=t.history,n=t.location;return r.createElement("div",{style:{display:"/"===n.pathname?"":"none"}},r.createElement("p",null,"Hi App!"),r.createElement("p",null,r.createElement("a",{href:"javascript:;",onClick:function(){return e.push("/hello")}},"go hello")),r.createElement("p",null,r.createElement("a",{href:"javascript:;",onClick:function(){return e.push("/calculator")}},"go calculator")),r.createElement("hr",null),r.createElement(o.a,{text:"\u65e5\u5386"}))},e}(r.Component));e.default=l},60:function(t,e,n){"use strict";e.b=function(t,e){function n(){this.constructor=t}a(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},e.a=function(t,e,n,a){return new(n||(n=Promise))(function(r,o){function i(t){try{s(a.next(t))}catch(t){o(t)}}function l(t){try{s(a.throw(t))}catch(t){o(t)}}function s(t){t.done?r(t.value):new n(function(e){e(t.value)}).then(i,l)}s((a=a.apply(t,e||[])).next())})},e.c=function(t,e){var n,a,r,o,i={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:l(0),throw:l(1),return:l(2)},"function"===typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function l(o){return function(l){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,a&&(r=2&o[0]?a.return:o[0]?a.throw||((r=a.return)&&r.call(a),0):a.next)&&!(r=r.call(a,o[1])).done)return r;switch(a=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,a=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(r=(r=i.trys).length>0&&r[r.length-1])&&(6===o[0]||2===o[0])){i=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){i.label=o[1];break}if(6===o[0]&&i.label<r[1]){i.label=r[1],r=o;break}if(r&&i.label<r[2]){i.label=r[2],i.ops.push(o);break}r[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(t){o=[6,t],a=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}};var a=function(t,e){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)}},61:function(t,e,n){"use strict";e.b=function(t){var e=t.timeStamp,n=t.splitChar,a=void 0===n?"-":n,r=new Date(e),o=r.getFullYear(),i=(r.getMonth()+1+"").padStart(2,"0"),l=(r.getDate()+"").padStart(2,"0"),s=(r.getHours()+"").padStart(2,"0"),c=(r.getMinutes()+"").padStart(2,"0"),p=(r.getSeconds()+"").padStart(2,"0");return""+o+a+i+a+l+" "+s+":"+c+":"+p},e.a=function(t){var e=void 0===t?{name:"\u5c0f\u660e",age:13}:t,n=e.name,a=e.age;return n+"\u4eca\u5e74"+a+"\u5c81\u4e86"}},64:function(t,e,n){"use strict";var a=n(0),r=(n.n(a),n(65)),o=n(61),i=a.useState,l=a.useEffect;e.a=function(t){var e=t.text,n=Object(o.a)(),s=i(Object(o.b)({timeStamp:Date.now(),splitChar:"/"})),c=s[0],p=s[1],f=setInterval(function(){p(Object(o.b)({timeStamp:Date.now(),splitChar:"/"}))},1e3);l(function(){return function(){clearInterval(f)}});var u={year:(new Date).getFullYear(),month:(new Date).getMonth()+1};return a.createElement("section",null,e,a.createElement("div",null,"\u65f6\u95f4\uff1a",c),n,a.createElement(r.a,{year:u.year,month:u.month}))}},65:function(t,e,n){"use strict";var a=n(0),r=(n.n(a),n(61)),o=n(66),i=n(67),l=n.n(i),s=a.useEffect,c=a.useState;e.a=function(t){var e=["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],n=c(t),i=n[0],p=n[1],f=c([[]]),u=f[0],m=f[1],d=c(Object(r.b)({timeStamp:Date.now()}).split(" ")[0]),A=d[0],h=d[1];function y(t){var e=i.year,n=i.month,a={year:e,month:n};"prev"===t&&(n>1?a={year:e,month:+n-1}:1===n&&(a={year:+e-1,month:12})),"next"===t&&(n<12?a={year:e,month:+n+1}:12===n&&(a={year:+e+1,month:1})),setTimeout(function(){p(a),m(Object(o.a)(a))},0)}function g(t){var e=t.year,n=t.month,a=t.date,r=Date.now(),i=Object(o.b)(r),l=i.year,s=i.month,c=i.date;return e===l&&n===s&&a===c}return s(function(){m(Object(o.a)(t))},[]),a.createElement("section",{className:l.a.calendar,"data-month":i.month},a.createElement("div",{className:l.a["year-month"]},a.createElement("span",{onClick:function(){return y("prev")}},"\u300a"),a.createElement("div",null,i.year,"/",(i.month+"").padStart(2,"0")),a.createElement("span",{onClick:function(){return y("next")}},"\u300b")),a.createElement("div",{className:l.a.weekday},e.map(function(t,n){return a.createElement("div",{key:n,className:0===n||n===e.length-1?l.a.weekend:""},t)})),a.createElement("div",{className:l.a["month-day"]},u.map(function(t,e){return a.createElement("section",{className:l.a["week-item"],key:e},t.map(function(t,e){return a.createElement("div",{key:e,className:l.a["date-item"]+" "+(g(t)?l.a["is-today"]:"")+" "+(function(t){var e=t.year,n=t.month,a=t.date,r=A.split("-"),o=r[0],i=r[1],l=r[2];return+o===e&&+i===n&&+l===a}(t)?l.a["active-date"]:""),onTouchStart:function(){return function(t){var e=t.year,n=t.month,a=t.date;a&&h(e+"-"+n+"-"+a)}(t)}},a.createElement("div",null,g(t)?"\u4eca\u5929":t.date))}))})))}},66:function(t,e,n){"use strict";function a(t){var e=t.year,n=t.month,a=t.date,o=r(new Date(e+"/"+n+"/"+a).getTime()),i=o.year,l=o.month,s=o.date;return e===i&&n===l&&a===s}function r(t){var e=new Date(t);return{year:e.getFullYear(),month:e.getMonth()+1,date:e.getDate()}}e.a=function(t){var e=void 0===t?{year:(new Date).getFullYear(),month:(new Date).getMonth()+1}:t,n=e.year,r=e.month,o=new Array(7).fill(""),i=new Date(n+"-"+r+"-01").getDay(),l=[[],[],[],[],[],[]];return o.map(function(t,e){l[0].push({year:n,month:r,date:e<i?"":e===i?1:l[0][e-1].date+1}),l[1].push({year:n,month:r,date:7-i+e+1}),l[2].push({year:n,month:r,date:l[1][e].date+7}),l[3].push({year:n,month:r,date:l[2][e].date+7}),a({year:n,month:r,date:l[3][e].date+7})?l[4].push({year:n,month:r,date:l[3][e].date+7}):l[4].push(""),a({year:n,month:r,date:l[4][e].date+7})?l[5].push({year:n,month:r,date:l[4][e].date+7}):l[5].push("")}),l.filter(function(t){return t[0]})},e.b=r},67:function(t,e,n){var a=n(68);"string"===typeof a&&(a=[[t.i,a,""]]);var r={hmr:!0,transform:void 0};n(53)(a,r);a.locals&&(t.exports=a.locals)},68:function(t,e,n){(e=t.exports=n(52)(void 0)).push([t.i,".calendar__ATftkf {\n  position: relative;\n  padding: 20px 4px;\n  color: #2b2b2b;\n  margin-top: attr(data-px); }\n  .calendar__ATftkf::before {\n    content: attr(data-month);\n    display: block;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n        -ms-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%);\n    color: #f1f1f1;\n    font-size: 70px;\n    z-index: -1; }\n\n.year-month__2ASAwR {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: justify;\n      justify-content: space-between;\n  text-align: center; }\n  .year-month__2ASAwR > div {\n    -ms-flex: 2 1;\n        flex: 2 1; }\n    .year-month__2ASAwR > div:active {\n      background: #fafafa; }\n  .year-month__2ASAwR > span {\n    -ms-flex: 1 1;\n        flex: 1 1; }\n    .year-month__2ASAwR > span:active {\n      background: #fafafa; }\n\n.weekday__nP5USm {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: start;\n      justify-content: flex-start;\n  padding: 8px 0;\n  color: #999; }\n  .weekday__nP5USm > div {\n    -ms-flex: 1 1;\n        flex: 1 1;\n    text-align: center; }\n  .weekday__nP5USm .weekend__1wqiWA {\n    color: lightcoral; }\n\n.week-item__2nhQvl {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-pack: start;\n      justify-content: flex-start; }\n\n.date-item__2FWmwW {\n  -ms-flex: 1 1;\n      flex: 1 1;\n  padding: 12px 0;\n  text-align: center; }\n\n.is-today__38-OO- {\n  font-size: 80%; }\n  .is-today__38-OO-::before {\n    background: lightcoral;\n    opacity: .5; }\n\n.active-date__1hg6Lx::before {\n  opacity: 1; }\n\n.is-today__38-OO-,\n.active-date__1hg6Lx {\n  position: relative;\n  color: #fff; }\n  .is-today__38-OO-::before,\n  .active-date__1hg6Lx::before {\n    content: '';\n    width: 40px;\n    height: 40px;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n        -ms-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%);\n    display: block;\n    border-radius: 40px;\n    background: -webkit-linear-gradient(135deg, #f1a884, lightcoral);\n    background: -o-linear-gradient(135deg, #f1a884, lightcoral);\n    background: linear-gradient(-45deg, #f1a884, lightcoral);\n    -webkit-box-shadow: 0 1px 6px -1px lightcoral;\n            box-shadow: 0 1px 6px -1px lightcoral;\n    z-index: -1; }\n",""]),e.locals={calendar:"calendar__ATftkf","year-month":"year-month__2ASAwR",weekday:"weekday__nP5USm",weekend:"weekend__1wqiWA","week-item":"week-item__2nhQvl","date-item":"date-item__2FWmwW","is-today":"is-today__38-OO-","active-date":"active-date__1hg6Lx"}},69:function(t,e,n){var a=n(70);"string"===typeof a&&(a=[[t.i,a,""]]);var r={hmr:!1,transform:void 0};n(53)(a,r);a.locals&&(t.exports=a.locals)},70:function(t,e,n){(t.exports=n(52)(!0)).push([t.i,".App{text-align:center}.App-logo{-webkit-animation:App-logo-spin infinite 20s linear;animation:App-logo-spin infinite 20s linear;height:80px}.App-header{background-color:#222;height:150px;padding:20px;color:#fff}.App-title{font-size:1.5em}.App-intro{font-size:large}@-webkit-keyframes App-logo-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes App-logo-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}","",{version:3,sources:["D:/code/react-ts/src/App.css"],names:[],mappings:"AAAA,KACE,iBAAmB,CACpB,AAED,UACE,oDAAqD,AAC7C,4CAA6C,AACrD,WAAa,CACd,AAED,YACE,sBAAuB,AACvB,aAAc,AACd,aAAc,AACd,UAAa,CACd,AAED,WACE,eAAiB,CAClB,AAED,WACE,eAAiB,CAClB,AAED,iCACE,GAAO,+BAAgC,AAAC,sBAAwB,CAAE,AAClE,GAAK,gCAAkC,AAAC,uBAA0B,CAAE,CACrE,AAED,yBACE,GAAO,+BAAgC,AAAC,sBAAwB,CAAE,AAClE,GAAK,gCAAkC,AAAC,uBAA0B,CAAE,CACrE",file:"App.css",sourcesContent:[".App {\n  text-align: center;\n}\n\n.App-logo {\n  -webkit-animation: App-logo-spin infinite 20s linear;\n          animation: App-logo-spin infinite 20s linear;\n  height: 80px;\n}\n\n.App-header {\n  background-color: #222;\n  height: 150px;\n  padding: 20px;\n  color: white;\n}\n\n.App-title {\n  font-size: 1.5em;\n}\n\n.App-intro {\n  font-size: large;\n}\n\n@-webkit-keyframes App-logo-spin {\n  from { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\n  to { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n}\n\n@keyframes App-logo-spin {\n  from { -webkit-transform: rotate(0deg); transform: rotate(0deg); }\n  to { -webkit-transform: rotate(360deg); transform: rotate(360deg); }\n}\n"],sourceRoot:""}])}});
//# sourceMappingURL=0.da7ad2db.chunk.js.map