(this["webpackJsonpmd-note"]=this["webpackJsonpmd-note"]||[]).push([[6],{72:function(e,t,n){e.exports={"note-list":"noteList_note-list__Fam2w",add:"noteList_add__u0lP1","month-item":"noteList_month-item__1ik4y","item-month":"noteList_item-month__1eENs","item-month-en":"noteList_item-month-en__1k0sL","note-item":"noteList_note-item__2tDXJ","item-date":"noteList_item-date__2d5pd",time:"noteList_time__1eDmB",date:"noteList_date__3z7yY","item-desc":"noteList_item-desc__2pf3i",skeleton:"noteList_skeleton__3OL71",loading:"noteList_loading__2b5RR"}},95:function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),o=n(3),c=n(23),s=n(56),r=n(64),l=Object(r.createModel)((function(){var e=Object(a.useState)(!1),t=Object(s.a)(e,2),n=t[0],i=t[1],o=Object(a.useState)(0),c=Object(s.a)(o,2),r=c[0],l=c[1];return Object(a.useEffect)((function(){l(window.innerHeight)}),[]),{isMobile:n,setIsMobile:i,height:r}})),d=n(62),m=n(72),u=n.n(m);var f=function(e){var t,n=e.show,o=void 0===n||n,c=Object(a.useRef)(),r=l().height,m=Object(d.a)(),f=m.loading,_=m.noteList,v=Object(a.useState)(),b=Object(s.a)(v,2),h=b[0],E=b[1],L=Object(a.useState)(0),p=Object(s.a)(L,2),O=p[0],j=p[1];function k(){var e=document.body.clientWidth,t=e>1100?{left:"".concat((e-1100)/2+1100-60,"px")}:{right:"12px"};E(t)}return Object(a.useEffect)((function(){return k(),window.addEventListener("resize",k),function(){window.removeEventListener("resize",k)}}),[]),Object(a.useEffect)((function(){var e;function t(e){j(e.target.scrollTop||O)}return c.current=document.querySelector(".".concat(u.a["note-list"])),null===(e=c.current)||void 0===e||e.addEventListener("scroll",t),function(){var e;null===(e=c.current)||void 0===e||e.removeEventListener("scroll",t)}}),[]),Object(a.useEffect)((function(){o&&c.current&&(c.current.scrollTop=O)}),[o]),i.a.createElement("div",{className:"center-content ".concat(u.a["note-list"]," dark"),style:{height:r,display:o?"block":"none"}},i.a.createElement("div",{className:"border-1px-bottom title dark"},i.a.createElement("span",null,"md-note")),i.a.createElement("section",{id:f?u.a.skeleton:"",className:u.a["month-item"]},(null===_||void 0===_?void 0:_.length)>0?null===_||void 0===_||null===(t=_.map)||void 0===t?void 0:t.call(_,(function(e,t){return i.a.createElement("a",{className:"link ".concat(u.a["note-item"]),key:t,href:"./#/detail/".concat(e.id)},i.a.createElement("div",{className:u.a["item-date"]},i.a.createElement("div",{className:u.a.time},e.date.substr(11,5)),i.a.createElement("div",{className:u.a.date},e.date.substr(5,5))),i.a.createElement("div",{className:u.a["item-desc"]},e.desc))})):i.a.createElement("div",null,"\u6ca1\u6709\u6570\u636e")),i.a.createElement("a",{href:"./#/note-add",className:"link btn dark ".concat(u.a.add),style:h},"+"))},_=function(e){var t=e.pathname,n=e.children;Object(a.useEffect)((function(){t.includes("/detail/")?o("md-note|\u8be6\u60c5"):t.includes("/md-editor/")?o("md-note|\u7f16\u8f91"):t.includes("/note-add")?o("md-note|\u6dfb\u52a0"):o("md-note")}),[t]);var o=function(e){return document.title=e};return i.a.createElement(i.a.Fragment,null,n)};t.default=function(e){var t=e.children,n=l().setIsMobile,s=Object(o.useLocation)().pathname;return Object(a.useEffect)((function(){var e=c.a.test(window.navigator.userAgent);n(e)}),[]),i.a.createElement(_,{pathname:s},t,i.a.createElement(f,{show:"/"===s}))}}}]);