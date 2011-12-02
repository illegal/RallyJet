/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


var rally=rally||{};

rally.sdk=rally.sdk||{};

rally.sdk.web_service_version="1.27";

rally.sdk.component_version="11-08-2011";

rally.onLoads=[];

rally.addOnLoad=function(funcToAdd,_2){
    var _3=function(){
        function _4(){
            dojo.forEach(rally.onLoads,function(_5){dojo.addOnLoad(_5);});
            rally.onLoads=[];
        };
        function _6(){
            rally.sdk.util.Login.doLogin(rally.sdk.info.loginKey,_4);
        };
        
        if(window.dojo&&window.dojo.addOnLoad&&rally.sdk.ui){
            if(rally.sdk.info.loginKey&&!rally.sdk.util.Context.isInsideRally()&&!_2){
                if(rally.onLoads.length===0){
                    dojo.addOnLoad(_6);
                }
                rally.onLoads.push(funcToAdd);
            }else{
                dojo.addOnLoad(funcToAdd);
            }
        }else{
            setTimeout(_3,100);
        }
    };
    
    _3();
};

rally.sdk.loader=function(){
    this._getIncludes=function(_7){
        return document.getElementsByTagName("head")[0].getElementsByTagName(_7);
    };
    
    this._getInclude=function(_8,_9){
        var _a=this._getIncludes(_8);
        for(var i=0;i<_a.length;i++){
            var _b=_a[i].getAttribute(_8==="script"?"src":"href");
            if(typeof _b==="string"&&_b.indexOf(_9)>-1){
                return _a[i];
            }
        }
        
        return null;
    };
    
    this._getSDKInformation=function(){
        var _c={
            path:".",
            debug:false
        };
        
        var _d=this._getInclude("script","sdk.js");
        
        if(!_d){
            var _e=document.getElementsByTagName("script");
            for(var i=0;i<_e.length;i++){
                var _f=_e[i].getAttribute("src");
                if(_f&&_f.indexOf("sdk.js")>-1){
                    _d=_e[i];
                    break;
                }
            }
        }
        
        if(_d){
            var _10=_d.getAttribute("src");
            var _11=_10.split("/");
            _11.pop();
            _c.path=_11.join("/");
            if(_10.indexOf("?")>-1){
                var _12=_10.substring(_10.indexOf("?")+1);
                var _13=_12.split("&");
                for(var j=0;j<_13.length;j++){
                    var _14=_13[j].split("=");
                    if(_14.length===2){
                        _c[_14[0]]=_14[1];
                     }
                }
            }
        }
        
        return _c;
    };
    
    this._isInsideRally=function(_15){
        return _15.indexOf("/slm/")>=0;
    };
    
    this.load=function(){
        var _16=this._getSDKInformation();
        rally.sdk.info=_16;
        var _17=_16.debug?".uncompressed.js":"";
        if(_16.debug==="true"){
            rally.sdk.debug=true;
        }
        
        rally.sdk.loader.launcherPath=_16.path;
        rally.sdk.loader.loadScript(rally.sdk.loader.launcherPath+"/../lib/ejsc/EJSChart.js");
        window.djConfig={
            parseOnLoad:true,
            locale:"en-us",
            isDebug:false
        };
        
        rally.sdk.loader.loadScript(rally.sdk.loader.launcherPath+"/../dojo/1.5/dojo/dojo"+(!this._isInsideRally(window.location.href)?".xd.js":".js")+_17);
        rally.sdk.loader.loadStylesheet(rally.sdk.loader.launcherPath+"/component_"+rally.sdk.component_version+".css",this._getInclude("script","sdk.js"));
        
        function _18(){
            if(window.dojo&&window.dojo.addOnLoad){
                dojo.addOnLoad(function(){dojo.query("body").addClass("tundra");});rally.sdk.loader.loadScript(rally.sdk.loader.launcherPath+"/component_"+rally.sdk.component_version+".js"+_17);
            }else{
                setTimeout(_18,100);
            }
        };
        
        _18();
    };
};

rally.sdk.loader.loadStylesheet=function(_19,_1a){
    var css=document.createElement("link");
    css.setAttribute("rel","stylesheet");
    css.setAttribute("type","text/css");
    css.setAttribute("href",_19);
    if(_1a&&_1a.nextSibling){
        document.getElementsByTagName("head")[0].insertBefore(css,_1a.nextSibling);
    }else{
        document.getElementsByTagName("head")[0].appendChild(css);
    }
};

rally.sdk.loader.loadScript=function(_1b,_1c){
    var _1d=document.createElement("script");
    var _1e;
    _1d.setAttribute("type","text/javascript");
    _1d.setAttribute("src",_1b);
    if(_1c){
        for(_1e in _1c){
            if(_1c.hasOwnProperty(_1e)){
                _1d.setAttribute("attribute",_1c[_1e]);
            }
        }
    }
    
    document.getElementsByTagName("head")[0].appendChild(_1d);
};

var loader=new rally.sdk.loader();

loader.load();