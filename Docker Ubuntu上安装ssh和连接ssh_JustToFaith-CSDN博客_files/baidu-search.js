"use strict";function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}!function(e){var t,n,a;a={API_SERVER:"//zhannei-dm.csdn.net/",API_BAIDU_SERVER:"https://gsp0.baidu.com/yrwHcjSl0MgCo2Kml5_Y_D3/",API_KEYWORD_GET_URL:"recommend/baidu_keyword",API_BAIDU_CACHE_URL:"recommend/baidu_zhannei_search",API_STATISTIC_SERVER:"//statistic.csdn.net/",SUB_DOMAIN:["blog.csdn.net","download.csdn.net","bbs.csdn.net","edu.csdn.net","ask.csdn.net","www.csdn.net"],keyword:"",autorun:!1,install:!0,baiduSearchAPPID:"10742016945123576423",debug:{active:!1,currentUrl:"http://blog.csdn.net/dqcfkyqdxym3f8rb0/article/details/66666666",API_SERVER:"http://devpassport.csdn.net/"}};for(var c in a)"API_SERVER"!=c&&"API_STATISTIC_SERVER"!=c&&"API_BAIDU_SERVER"!=c&&c.indexOf("API")>-1&&(a.debug.active?a[c]=a.debug.API_SERVER+a[c]:a[c]=a.API_SERVER+a[c]);"http:"==window.location.protocol&&(a.API_BAIDU_SERVER="http://zhannei.baidu.com/"),n={getRequest:function(e,t){var n,a,c,r={};switch(t=t||"search"){case"hash":n=e.split("#")[1]||"";break;case"search":n=e.split("?")[1]||"",n=n.split("#")[0]}for(c=n.split("&"),a=0;a<c.length;a++)r[c[a].split("=")[0]]=decodeURI(c[a].split("=")[1]);return r},parseCFG:function(){if(document.getElementsByTagName("meta")["csdn-baidu-search"]){var e={},e=JSON.parse(document.getElementsByTagName("meta")["csdn-baidu-search"].content);a.keyword=e.keyword||a.keyword,a.autorun="true"==e.autorun,a.install="false"!=e.install,void 0}},autorun:function(){void 0,""!=a.keyword?csdn.baiduSearch(a.keyword,function(e){csdn.baiduCacheBuild(a.keyword,e)}):csdn.baiduKeywordGet(function(e){csdn.baiduSearch(e,function(t){csdn.baiduCacheBuild(e,t)})})},trackByGraylog:function(t,n){e.get(a.API_STATISTIC_SERVER+t,n)},filterData:function(e){var t=[];for(var n in e){var a=e[n];if(!/^((https|http)?:\/\/)(.*)download.csdn.net[^\s]+/.test(a.linkUrl)||/^((https|http)?:\/\/)download.csdn.net\/download\/[^\s]+/.test(a.linkUrl)){var c=a.title;c=c.replace("-<em>CSDN</em>下载",""),c=c.replace("- <em>CSDN</em>下载",""),c=c.replace(" - 下载频道 - CSDN.NET",""),c=c.replace(/[-_]CSDN(下载|博客)/gm,""),c!==a.title&&void 0,a.title=c,t.push(a)}else void 0}return t},checkDomain:function(e,t,n){if(e.indexOf("/")>-1)n.push(e.split("/")[1]);else{var a=e.split(".csdn.net");a.length>1&&(e=a[0]),csdn.cse.setSearchRange(2,[e+".csdn.net"]),t.push(e+".csdn.net")}return{two:t,thir:n}},unique:function(e){String.prototype.endsWith||(String.prototype.endsWith=function(e,t){return(void 0===t||t>this.length)&&(t=this.length),this.substring(t-e.length,t)===e});var t=window.location.pathname.split("/").pop(),n=_defineProperty({},t,1);return e.filter(function(e){var t=e.linkUrl;~t.indexOf("?")?t=t.split("?")[0]:~t.indexOf("#")&&(t=t.split("#")[0]),t=t.endsWith("/")?t.slice(0,t.length-1):t;var a=t.split("/").pop();return!n[a]&&(n[a]=1)})}},t={baiduSearchInstall:function(e){var t=document.createElement("script");t.type="text/javascript",t.charset="utf-8",t.async=!0,t.src=a.API_BAIDU_SERVER+"api/customsearch/apiaccept?sid="+a.baiduSearchAPPID+"&v=2.0&callback=csdn.afterBaiduSearchInit",t.onerror=function(){n.trackByGraylog("baidu_search_error",{step:"install"}),void 0,"function"==typeof csdn.baiduSearchInstallError&&csdn.baiduSearchInstallError()};var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(t,c)},afterBaiduSearchInit:function(){if(csdn.cse=new BCse.Search(a.baiduSearchAPPID),"function"==typeof csdn.afterCasInit)return void csdn.afterCasInit(a.keyword,csdn.cse);a.autorun&&n.autorun()},baiduSearch:function(e,t,c,r){if(void 0,c){var s=[],i=[];if(-1===Object.prototype.toString.call(c).indexOf("Array")){var o=n.checkDomain(c,s,i);s=o.two,i=o.thir}else for(var d=0;d<c.length;d++){var o=n.checkDomain(c[d],s,i);s=o.two,i=o.thir}void 0,s.length>0&&csdn.cse.setSearchRange(2,s),i.length>0&&csdn.cse.setSearchRange(3,i)}else csdn.cse.setSearchRange(2,a.SUB_DOMAIN);r||(r=1),csdn.cse.getResult(e,function(a){n.trackByGraylog("baidu_search_success"),a=n.filterData(a),void 0,csdn.baiduCacheBuild(e,a,r);var c=n.unique(a);void 0,t(c)},r)},baiduKeywordGet:function(t){e.ajax({url:a.API_KEYWORD_GET_URL,type:"GET",contentType:"text/plain;charset=UTF-8",data:{url:a.debug.active?a.debug.currentUrl:window.location.href,result_size:1},success:function(e){void 0,e.length>0&&(a.debug.active&&(void 0,void 0),t(e[0].keyword))}})},baiduCacheBuild:function(t,n,c){var r="?keyword="+t+"&page_no="+c;"2"==csdn.cse.param.ct&&-1==csdn.cse.param.cc.indexOf("%26")?r+="&domain_type="+csdn.cse.param.cc.split(".csdn.net")[0]:"3"==csdn.cse.param.ct&&(r+="&url_type="+csdn.cse.param.cc),e.ajax({url:a.API_BAIDU_CACHE_URL+r,type:"POST",dataType:"text",contentType:"text/plain;charset=UTF-8",data:JSON.stringify(n)})},baiduSearchCFG:a},void 0===window.csdn&&(window.csdn={});for(c in t)window.csdn[c]=t[c];n.parseCFG(),a.install&&csdn.baiduSearchInstall()}(jQuery);