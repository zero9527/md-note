(this["webpackJsonpmd-note"]=this["webpackJsonpmd-note"]||[]).push([[5],{103:function(e,t,n){"use strict";n.r(t);var a=n(70),c=n.n(a),l=n(71),o=n(12),r=n(3),i=n(0),s=n.n(i),u=n(4),d=n(66),m=n(67),f=n(11),b=n(8),v=n(74),h=n(69),p=n(30),y=n(72),_=n(18),E=n(75);function O(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var g=n(17),j=n(91),N=n.n(j),w=function(e){var t=e.mdtext,n=e.defaultActive,a=e.onCateClick,c=e.onGetTitle,l=Object(g.a)(e,["mdtext","defaultActive","onCateClick","onGetTitle"]),o=Object(_.a)(),u=o.scrollTop,f=o.prevScrollTop,b=Object(i.useRef)(!0),v=Object(i.useState)(!1),h=Object(r.a)(v,2),p=h[0],y=h[1],E=Object(i.useState)([]),j=Object(r.a)(E,2),w=j[0],k=j[1],x=Object(i.useState)(""),S=Object(r.a)(x,2),C=S[0],I=S[1],B=Object(i.useState)(""),T=Object(r.a)(B,2),A=T[0],L=T[1],Y=Object(i.useState)([]),P=Object(r.a)(Y,2),R=P[0],G=P[1];Object(i.useEffect)((function(){A&&(document.title="MD-NOTE|".concat(A),null===c||void 0===c||c(A))}),[A]),Object(i.useEffect)((function(){n&&I(n)}),[]),Object(i.useEffect)((function(){q()}),[C]),Object(i.useEffect)((function(){D()}),[]),Object(i.useEffect)((function(){document.body.style.overflowY=p?"hidden":"auto"}),[p]),Object(i.useEffect)((function(){G(function e(t){var n=[];return t.forEach((function(t){var a;(null===t||void 0===t||null===(a=t.child)||void 0===a?void 0:a.length)?n.push.apply(n,[t].concat(O(e(t.child)))):n.push(t)})),n}(w))}),[w]),Object(i.useEffect)((function(){b.current&&V()}),[u]);var V=function(){try{R.forEach((function(e){var t=document.getElementById(e.id);t&&(t.getBoundingClientRect().top<20&&I(e.id))}))}catch(e){console.error(e)}},D=function(){var e=[],n=[],a=t.slice(t.indexOf("\n"),t.length);L(t.slice(2,t.indexOf("\n"))),a.split("\n## ").forEach((function(t){var a=t.substring(0,t.indexOf("\n")).trim(),c=t.split("\n### ");c.shift();var l=[];c.forEach((function(e){var t=e.substring(0,e.indexOf("\n")).trim();l.push({id:t,header:"catelog-".concat(t),label:t})}));var o={id:a,header:"catelog-".concat(a),label:a,child:[]};e.push(a),l.length>0&&(o.child=l,e=e.concat(l.map((function(e){return e.id})))),n.push(o)})),k((function(){return n.filter((function(e){return Boolean(e.id)}))}))},q=function(){var e=document.getElementById("catelog-".concat(C));null===e||void 0===e||e.scrollIntoView(),null===a||void 0===a||a(C)},F=function(e){var t;null===(t=document.querySelector("#md-note"))||void 0===t||t.classList[e]("blur")},J=Object(i.useCallback)((function(e){var t="".concat(N.a["cate-item"]," ").concat(C===e.id?N.a.active:"");return s.a.createElement("div",{"data-id":e.id,id:e.header,className:t,onClick:function(){return function(e){var t=document.getElementById(e.id);null===t||void 0===t||t.scrollIntoView(),b.current=!1,F("remove"),I(e.id),null===a||void 0===a||a(e.id),setTimeout((function(){y(!1),b.current=!0}),0)}(e)}},e.label)}),[C]),M=Object(i.useMemo)((function(){return p?N.a["cate-show"]:""}),[p]);return s.a.createElement("div",{id:"catalog",className:N.a.catalog},s.a.createElement(d.a,{className:"btn",icon:m.g,onClick:function(){F("add"),setTimeout((function(){return y(!0)}),0)}}),s.a.createElement("div",{className:N.a.bg,style:{display:p?"block":"none"}}),s.a.createElement("div",{style:{marginTop:u>50&&u>f?"0":""},className:"".concat(N.a.catelist," ").concat(M),onClick:function(e){return e.stopPropagation()}},p&&s.a.createElement("span",{className:N.a.close,onClick:function(){y(!1),F("remove")}},s.a.createElement(d.a,{icon:m.d})),s.a.createElement("section",{className:N.a.head,title:A},"\u76ee\u5f55: ",A),s.a.createElement("section",{className:N.a["cate-content"]},w.length>0?w.map((function(e){var t,n;return s.a.createElement("ul",{key:e.id},J(e),e.child&&(null===(t=e.child)||void 0===t?void 0:t.length)>0&&(null===(n=e.child)||void 0===n?void 0:n.map((function(e){return s.a.createElement("ul",{key:e.id},J(e))}))))})):s.a.createElement((function(){return s.a.createElement("div",{className:N.a.desc},s.a.createElement("p",null,"\u4e00\u7ea7\u6807\u9898'#'\u4e3a\u6587\u7ae0\u540d\uff0c"),s.a.createElement("p",null,"\u4e8c\u7ea7\u6807\u9898'##'\u4e3a\u4e00\u7ea7\u76ee\u5f55\uff0c"),s.a.createElement("p",null,"\u4e09\u7ea7\u6807\u9898'###'\u4e3a\u4e09\u7ea7\u76ee\u5f55"))}),null))),l.children)},k=n(5),x=n.n(k),S=n(90),C=n.n(S),I=function(e){var t=e.show,n=e.src,a=e.alt,c=e.onClose;return Object(i.useEffect)((function(){var e=document.querySelector("#md-note"),n=document.querySelector("#catalog");return t?(e.classList.add("blur"),n.classList.add("blur"),document.body.style.overflowY="hidden"):(e.classList.remove("blur"),n.classList.remove("blur"),document.body.style.overflowY=""),function(){e.classList.remove("blur"),n.classList.remove("blur"),document.body.style.overflowY=""}}),[t]),x.a.createPortal(s.a.createElement(s.a.Fragment,null,t&&s.a.createElement("section",{className:C.a["pic-preview"]},s.a.createElement("div",{className:C.a.content},s.a.createElement("button",{className:"btn ".concat(C.a.close),onClick:c},"X"),s.a.createElement("div",{className:C.a["img-content"]},n?s.a.createElement("img",{src:n,alt:a}):s.a.createElement("span",{className:C.a.loading},"\u6b63\u5728\u751f\u6210\u622a\u56fe\u3002\u3002\u3002")),s.a.createElement("div",{className:C.a.text},"\u5bfc\u51fa\u56fe\u7247\u9884\u89c8\uff0c\u53f3\u952e\u53e6\u5b58/\u957f\u6309\u4fdd\u5b58\uff01")))),document.body)},B=n(87),T=n.n(B);t.default=function(){var e=Object(f.a)((function(e){return[e.stickyRightStyle]})).stickyRightStyle,t=Object(h.a)((function(e){return[e.getNoteById,e.updateNoteById,e.fetchNoteByName]})),n=t.getNoteById,a=t.updateNoteById,O=t.fetchNoteByName,g=Object(u.useParams)(),j=g.tag,N=g.name,k=Object(u.useHistory)(),x=Object(u.useLocation)(),S=Object(_.a)().scrollTop,C=Object(i.useState)(!1),B=Object(r.a)(C,2),A=B[0],L=B[1],Y=Object(i.useState)(""),P=Object(r.a)(Y,2),R=P[0],G=P[1],V=Object(i.useState)(),D=Object(r.a)(V,2),q=D[0],F=D[1],J=Object(i.useState)(!1),M=Object(r.a)(J,2),H=M[0],Q=M[1],U=Object(i.useState)(),W=Object(r.a)(U,2),z=W[0],X=W[1],K=Object(i.useState)({show:!1,src:"",alt:"",onClose:function(){ee((function(e){return Object(o.a)({},e,{show:!1})}))}}),Z=Object(r.a)(K,2),$=Z[0],ee=Z[1];Object(i.useEffect)((function(){te()}),[]),Object(i.useEffect)((function(){ce()}),[S]);var te=function(){var e=Object(l.a)(c.a.mark((function e(){var t,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(null===(t=n(N))||void 0===t?void 0:t.data)){e.next=4;break}return F(t.data),e.abrupt("return");case 4:return e.prev=4,e.next=7,O(j,N);case 7:if(0!==(null===(l=e.sent)||void 0===l?void 0:l.code)){e.next=15;break}if(!l.data.substring(0,20).includes("<!DOCTYPE html>")){e.next=11;break}return e.abrupt("return");case 11:a(N,l.data),F(l.data),e.next=18;break;case 15:console.log("\u6570\u636e\u6ca1\u6709\u4e86\uff01"),F(""),L(!0);case 18:e.next=23;break;case 20:e.prev=20,e.t0=e.catch(4),console.error(e.t0);case 23:case"end":return e.stop()}}),e,null,[[4,20]])})));return function(){return e.apply(this,arguments)}}(),ne=function(){var e=document.querySelectorAll("#md-note .md-img");Array.from(e).forEach((function(e){e.onclick=function(){window.open(e.src)}}))},ae=function(e){if(e){var t=document.getElementById(e);null===t||void 0===t||t.scrollIntoView(),X(e)}},ce=function(){Q((function(){return S>window.innerHeight}))};return s.a.createElement(s.a.Fragment,null,s.a.createElement(y.a,{className:T.a.header},s.a.createElement("div",{className:"center-content"},s.a.createElement(d.a,{icon:m.c,className:T.a.back,title:"\u8fd4\u56de\u9996\u9875",onClick:function(){k.push("/")}}),s.a.createElement("span",{className:T.a.title,title:"\u6587\u7ae0\u6807\u9898"},"\xa0",R))),s.a.createElement("main",{className:"center-content ".concat(T.a["note-detail"])},q?s.a.createElement(s.a.Fragment,null,s.a.createElement(E.a,{mdtext:q,onMdRendered:function(){var e=x.hash.substr(1,x.hash.length);setTimeout((function(){ae(decodeURI(e)),ne()}),0)}}),s.a.createElement(I,$),s.a.createElement(p.a,null,s.a.createElement(w,{mdtext:q,defaultActive:z,onCateClick:function(e){k.replace({pathname:x.pathname,hash:e})},onGetTitle:function(e){G(e)}}))):!A&&s.a.createElement(b.a,null),A&&s.a.createElement((function(){return s.a.createElement("div",{className:T.a["article-404"]},"\u6587\u7ae0\u4e0d\u89c1\u4e86\u3002\u3002\u3002")}),null),H&&s.a.createElement(v.a,{position:e})))}},87:function(e,t,n){e.exports={"note-detail":"styles_note-detail__3afuD","article-404":"styles_article-404__1CD7e",header:"styles_header__3MAkJ",title:"styles_title__34nPG",back:"styles_back__1GbPv"}},90:function(e,t,n){e.exports={"pic-preview":"styles_pic-preview__3nwWG",content:"styles_content__3YpAz",close:"styles_close___WiVN",loading:"styles_loading__11oYs","img-content":"styles_img-content__1xEFJ",text:"styles_text__2esNx"}},91:function(e,t,n){e.exports={catalog:"styles_catalog__3Rgd8",bg:"styles_bg__Qied2",catelist:"styles_catelist__2V8B5",close:"styles_close__2lVDu",head:"styles_head__285P6",desc:"styles_desc__pQSnY","cate-content":"styles_cate-content__2INf6","cate-item":"styles_cate-item__2uw6a",active:"styles_active__i3r98","cate-show":"styles_cate-show__2_4IU"}}}]);