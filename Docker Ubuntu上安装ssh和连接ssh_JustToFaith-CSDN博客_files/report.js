!function(e){var t,o,r,n,i,c,a,s,d,u;i=[],t={DELAY:500,API_VERSION:"0.6.0",SERVER_URL:"https://event.csdn.net/"},u=["utm_source"],s={pv:t.SERVER_URL+"logstores/csdn-pc-tracking-pageview/track_ua.gif?APIVersion="+t.API_VERSION,click:t.SERVER_URL+"logstores/csdn-pc-tracking-page-click/track_ua.gif?APIVersion="+t.API_VERSION,view:t.SERVER_URL+"logstores/csdn-pc-tracking-page-exposure/track"},n={PV:"pv",VIEW:"view",DELAY_VIEW:"delay_view",CLICK:"click"},a={SKIPPED_AND_VISIBLE:"0",VISIBLE:"1"};if(r={guid:function(){return+new Date+"-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})},setLogIdCookie:function(e){if(-1===["pv","click","view"].indexOf(e))return void void 0;var t="log_Id_"+e,o=r.getCookie(t)||0;try{o=parseInt(o),"number"==typeof o&&isNaN(o)?r.setCookie(t,1,31536e7):r.setCookie(t,++o,31536e7)}catch(e){void 0}},getRequest:function(){for(var e=new Object,t=window.location.href.split("?")[1]||"",o=t.split("&"),r=0;r<o.length;r++){var n=o[r].split("=")[0],i=o[r].split("=")[1];n&&i&&(e[n]=unescape(i))}return e},initUTM:function(){d={};var e=r.getRequest();if("{}"!==JSON.stringify(e)){var t=!1;for(var o in e)if(0==o.indexOf("utm_")&&e.hasOwnProperty(o)){t=!0;break}if(t){var n=r.getFuzzyCookie("c_utm_"),i=n.split(";");for(var o in i)if(i.hasOwnProperty(o)){var c=i[o].split("=")[0];c&&(void 0,r.setCookie(c,"",-1))}void 0,r.setCookie("utm_source","",-1)}for(var o in e)0==o.indexOf("utm_")&&e.hasOwnProperty(o)&&(void 0,r.setCookie("c_"+o,e[o],36e5));for(var o in u)if(u.hasOwnProperty(o)){var a=u[o],s=e[u[o]];s?(r.setCookie(a,s,36e5),d[a]=s):d[a]=""}}else for(var o in u)if(u.hasOwnProperty(o)){var a=u[o],s=r.getCookie(a);d[a]=s}return d},initTraceInfo:function(){for(var e=["blog","bbs","download","ask","edu","biwen"],t=0;t<e.length;t++)window.location.host.indexOf(e[t]+".csdn.net")>-1&&(r.setCookie("c_page_id","",-1),r.setCookie("c_mod","",-1))},preserveTraceInfo:function(e){e.mod&&r.setCookie("c_mod",e.mod,36e5),e.page_id?r.setCookie("c_page_id",e.page_id,36e5):r.setCookie("c_page_id","default",36e5)},getTimestamp:function(){return Math.round(new Date/1e3)},getXPath:function(e){if(""!==e.id)return'//*[@id="'+e.id+'"]';if(e==document.body)return"/html/"+e.tagName.toLowerCase();if(!e.parentNode)return"";for(var t=1,o=e.parentNode.childNodes,r=0,n=o.length;r<n;r++){var i=o[r];if(i==e)return arguments.callee(e.parentNode)+"/"+e.tagName.toLowerCase()+"["+t+"]";1==i.nodeType&&i.tagName==e.tagName&&t++}},getScreen:function(){return window.screen.width+"*"+window.screen.height},getCookie:function(e){var t,o=new RegExp("(^| )"+e+"=([^;]*)(;|$)");return(t=document.cookie.match(o))?unescape(t[2]):""},getFuzzyCookie:function(e){var t,o=new RegExp(e+"[A-Za-z0-9_]+=([^;]*);","ig");return(t=document.cookie.match(o))?t.join(""):""},checkoutUtm:function(){var e=[],t=[],o=window.location.href.split("?")[1]||"";if(o.length){e=o.split("&");for(var r=0;r<e.length;r++)0==e[r].indexOf("utm_")&&t.push(e[r].split("=")[0])}return t},setCookie:function(e,t,o){var r=new Date;r.setTime(r.getTime()+o),document.cookie=e+"="+escape(t)+";expires="+r.toGMTString()+";path=/ ; domain=."+this.topDomain(window.location.host)},setUtmInfo:function(){},setUserSegment:function(){var e=(null!=(_ref1=/(; )?(uuid_tt_dd|_javaeye_cookie_id_)=([^;]+)/.exec(window.document.cookie))?_ref1[3]:void 0)||"",t=e?e.substring(e.length-6)%16:0;r.setCookie("c_segment",t)},setfirstPageInfo:function(){if(r.getCookie("c_first_ref")&&r.getCookie("c_first_ref").indexOf(".csdn.net")>-1)return void r.setCookie("c_first_ref","default");var e=new RegExp(/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/),t=window.document.referrer?window.document.referrer.match(e)[0]:"default";return t.indexOf(".csdn.net")>-1&&(t="default"),"default"!=t?(r.setCookie("c_first_ref",t),void r.setCookie("c_first_page",window.location.href)):r.getCookie("c_first_ref")?void 0:(r.setCookie("c_first_ref","default"),void r.setCookie("c_first_page",window.location.href))},initData:function(){r.setfirstPageInfo(),r.initTraceInfo(),r.setUserSegment();var t,o,n,i=(null!=(t=/(; )?(uuid_tt_dd|_javaeye_cookie_id_)=([^;]+)/.exec(window.document.cookie))?t[3]:void 0)||"",s=r.getCookie("dc_session_id");if(s||(s="10_"+(new Date).getTime()+"."+Math.random().toString().slice(-6)),r.setCookie("dc_session_id",s,18e5),c={cid:i,sid:s||"",pid:window.location.host.split(".csdn.net")[0],uid:r.getCookie("UserName"),did:r.getCookie("X-Device-ID")||i||"",dc_sid:r.getCookie("dc_sid"),ref:window.document.referrer,curl:window.location.href,dest:"",cfg:{viewStrategy:a.VISIBLE}},n=r.initUTM(),e("meta[name=report]").attr("content")){o=JSON.parse(e("meta[name=report]").attr("content"));try{for(var d=Object.prototype.hasOwnProperty,u=["disabledViewCheck"],f=0;f<u.length;f++)d.call(o,u[f])&&delete o[u[f]]}catch(e){void 0}}else o={};return c=e.extend({},c,{utm:n.utm_source},o),r.preserveTraceInfo(c),c},tos:function(){var e,t,o,r;e=+new Date/1e3|0,o=null!=(t=/\bdc_tos=([^;]*)(?:$|;)/.exec(document.cookie))?t[1]:void 0;try{r=e-parseInt(o,36)}catch(e){void 0,r=-1}return document.cookie="dc_tos="+e.toString(36)+" ; expires="+new Date(1e3*(e+14400)).toGMTString()+" ; max-age=14400 ; path=/ ; domain=."+this.topDomain(window.location.host),r},topDomain:function(e){return/\.?([a-z0-9\-]+\.[a-z0-9\-]+)(:\d+)?$/.exec(e)[1]},copyArr:function(e){for(var t=[],o=0;o<e.length;o++)t.push(e[o]);return t},isView:function(e,t){var o=this;if(!e)return!1;var r=this.getElementBottom(e),n=r+e.offsetHeight;return a.VISIBLE==t?o.scrollTop()<r&&r<o.scrollTop()+o.windowHeight()||o.scrollTop()<n&&n<o.scrollTop()+o.windowHeight():a.SKIPPED_AND_VISIBLE==t?r<=o.scrollTop()+o.windowHeight()||(o.scrollTop()<r&&r<o.scrollTop()+o.windowHeight()||o.scrollTop()<n&&n<o.scrollTop()+o.windowHeight()):void 0},scrollTop:function(){return Math.max(document.body.scrollTop,document.documentElement.scrollTop)},windowHeight:function(){return"CSS1Compat"==document.compatMode?document.documentElement.clientHeight:document.body.clientHeight},getElementTop:function(t){if("undefined"!=typeof jQuery)return e(t).offset().top;var o=t.offsetTop;for(t=t.offsetParent;null!=t;)o+=t.offsetTop,t=t.offsetParent;return o},getElementBottom:function(t){if("undefined"!=typeof jQuery)return e(t).offset().top+e(t).height();var o=t.offsetTop;for(t=t.offsetParent;null!=t;)o+=t.offsetTop,t=t.offsetParent;return o},url2Obj:function(e){var t={},o=e.split("&");for(var r in o)t.hasOwnProperty(r)&&(t[o[r].split("=")[0]]=decodeURIComponent(o[r].split("=")[1]));return t},fixParamConTop:function(t,o){return t.con.split(",top_")>-1?t:(t.con=t.con+",top_"+e(o).offset().top,t)},urlParamsToObj:function(e){var t={};return e.replace(/([^=&#]+)=([^&#]*)/g,function(){t[arguments[1]]=arguments[2]}),t},objToUrlParams:function(t){var o="";return e.each(t,function(e){o+="&"+e+"="+t[e]}),o.substr(1)},trackOrderSource:function(){var e=document.referrer;if(e){const t=document.createElement("a");if(t.href=e,-1!==t.hostname.indexOf("passport"))return;t.hostname.indexOf(".csdn.net")>-1?(r.setCookie("c_pref",r.getCookie("c_ref")),r.setCookie("c_ref",e)):(r.setCookie("c_pref",r.getCookie("c_ref")),r.setCookie("c_ref",e.split("?")[0]))}}},o={timer:0,checkTimer:0,getFullSpm:function(e){if(2===e.split(".").length){var t=document.querySelector('meta[name="report"]'),o=t&&t.getAttribute("content")||"{}",r=JSON.parse(o);return r.spm?r.spm+"."+e:e}return e},reportServer:function(o,c){void 0!==o&&void 0!==c&&i.push(c);var a=r.copyArr(i);if(0!=a.length){i=[];var d={__source__:"csdn",__logs__:a};if(r.setLogIdCookie(n.VIEW),o===n.VIEW||o===n.DELAY_VIEW){var u=window.navigator.userAgent;d.__tags__={useragent:u,log_id:r.getCookie("log_Id_"+n.VIEW)}}e.ajax({url:s[n.VIEW],type:"POST",crossDomain:!0,xhrFields:{withCredentials:!1},contentType:"text/plain;charset=UTF-8",headers:{"x-log-apiversion":t.API_VERSION,"x-log-bodyrawsize":"1234"},data:JSON.stringify(d),success:function(){},error:function(){void 0}})}},reportServerDelay:function(e,o){i.push(o);var r=this;r.timer&&clearTimeout(r.timer),r.timer=setTimeout(function(){r.reportServer(n.DELAY_VIEW)},t.DELAY)},reportView:function(t,o,i){if(!t)return void void 0;var a=e.extend(!0,{},c,t),s=r.getFuzzyCookie("c_");a.t=r.getTimestamp()+"",a.eleTop=o?o.offset().top+"":"",delete a.cfg,s&&(a.cCookie=s),a.__time__=r.getTimestamp(),a.curl=window.location.href,void 0===i?this.reportServerDelay(n.VIEW,a):this.reportServer(n.VIEW,a),"function"==typeof csdn.afterReportView&&csdn.afterReportView(o,t)},reportClick:function(t,o){var i=e.extend(!0,{},c,t);t.spm||(i.spm=""),i.spm=this.getFullSpm(i.spm),i.t=r.getTimestamp(),i.elePath=o?r.getXPath(o[0])+"":"",i.eleTop=o?o.offset().top+"":"",i.trace&&r.preserveTraceInfo(i);var a=r.getFuzzyCookie("c_");a&&(i.cCookie=a),i.curl=window.location.href,delete i.cfg,r.setLogIdCookie(n.CLICK),i.log_id=r.getCookie("log_Id_"+n.CLICK),e.ajax({url:s[n.CLICK],type:"get",crossDomain:!0,xhrFields:{withCredentials:!1},contentType:"text/plain;charset=UTF-8",data:i,success:function(){},error:function(){void 0}})},reportPageView:function(t){var o=e.extend(!0,{},c,t);o.tos=r.tos(),o.adb=r.getCookie("c_adb")||0,o.curl=window.location.href;var i=r.getFuzzyCookie("c_");i&&(o.cCookie=i),o.t=r.getTimestamp(),o.screen=r.getScreen(),o.un=r.getCookie("UN")||"",o.urn=r.guid(),o.vType=r.getCookie("p_uid")||"",delete o.cfg,delete o.dest,r.setLogIdCookie(n.PV),o.log_id=r.getCookie("log_Id_"+n.PV),e.ajax({url:s[n.PV],type:"get",crossDomain:!0,xhrFields:{withCredentials:!1},contentType:"text/plain;charset=UTF-8",data:o,success:function(){},error:function(){void 0}})},viewCheck:function(){var t=this;clearTimeout(t.checkTimer),t.checkTimer=setTimeout(function(){e("[data-report-view]").each(function(){var o=e(this),n=o.data("reportView"),i=e.extend({},c,n);n.spm||(i.spm=""),i.spm=t.getFullSpm(i.spm),i.curl=window.location.href,r.isView(o.get(0),i.cfg.viewStrategy)&&(csdn.report.reportView(i,o),o.removeData("reportView"),o.removeAttr("data-report-view"))})},200)},isView:function(e){return r.isView(e)},addSpmToHref:function(e){var t=e,o=this,n=t.data("reportQuery")||"";if(n){var i=t.attr("href"),c=i,a={};-1!==i.indexOf("?")&&(c=i.split("?")[0],a=r.urlParamsToObj(i.split("?")[1]));var s=r.urlParamsToObj(n);(n.indexOf("spm")>-1||n.indexOf("SPM")>-1)&&(s.spm=s.spm||s.SPM,s.spm=o.getFullSpm(s.spm)),c+="?"+r.objToUrlParams(Object.assign(a,s)),t.attr("href",c)}}},void 0===window.csdn&&(window.csdn={}),csdn.report)return void void 0;r.trackOrderSource(),window.csdn.report=o,c=r.initData(),c.disabled||csdn.report.reportPageView()}(jQuery),jQuery(function(){var e=csdn.report;jQuery(document).on("click","[data-report-click]",function(){var t=jQuery(this).data("reportClick");e.reportClick(t,jQuery(this))});var t=!0;if($("meta[name=report]").attr("content")){var o={};try{o=JSON.parse($("meta[name=report]").attr("content")),o.disabledViewCheck&&(t=!1)}catch(e){void 0}}t&&e.viewCheck(jQuery("[data-report-view]")),jQuery(window).on("scroll",function(){e.viewCheck(jQuery("[data-report-view]"))}),jQuery(document).on("contextmenu","a[data-report-query]",function(){e.addSpmToHref($(this))}),jQuery(document).on("click","a[data-report-query]",function(){e.addSpmToHref($(this))}),jQuery(document).on("click","a[href]",function(){var t=jQuery(this),o=t.attr("href");if(function(e){return!(!/^https:\/\/|^http:\/\//gi.test(e)||"/"===e||e.indexOf(".csdn.net")>-1||e.indexOf(".iteye.com")>-1)}(o)){var r={mod:"1583921753_001",dest:o};e.reportClick(r,t)}})});