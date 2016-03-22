<script type="text/javascript" async=1>
  
  
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
    p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
    };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
    n.src=w;g.parentNode.insertBefore(n,g)}}		(window,document,"script","//d1fc8wv8zag5ca.cloudfront.net/2.5.3/sp.js","_snaq"));
  
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
   
  // setup tracker
  snowplow(function () {
    var cookieDomain = '.' + window.location.hostname.replace(/www\./g, '').replace(/booking/g, '');
    
    //TODO: restore condition "all pages not MW"
    
    // cloudfront tracker for desktop
    // appId: window.location.hostname.replace(/www\./g, '').replace(/\./g, '-'),
	_snaq("newTracker", "cf", "d3a5i2xkv0tpsj.cloudfront.net", {
      	appId: window.location.hostname.replace(/www\./g, '').replace(/\./g, '-'),
        platform: "web", 
        setCookieDomain: cookieDomain,
	    encodeBase64: false,
        contexts: {
          webPage: true,
          performanceTiming: true
        }
      });
    
    
    // also setup clojure tracker for mobile
    if (isMobile) {
      _snaq("newTracker", "cj", "collector.goeuro.com", {
      	appId: 'test-home-contexts',
        platform: "web", 
        setCookieDomain: cookieDomain,
        encodeBase64: false,
        contexts: {
          webPage: true,
          performanceTiming: true
        }
      });
    }
    
    function localeStorageEnabled() {
      var storageType = 'localStorage';
      var supported = (storageType in window && window[storageType] !== null);
      var key = 'lsTest__' + Math.round(Math.random() * 1e7);
      if (supported) {
        webStorage = window[storageType];
        webStorage.setItem(key, '');
        webStorage.removeItem(key);
      }

      return supported;  
    }
  
	function generateUUID(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
          d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
	}
/*    
    // set page type
    // landing_page for SEO
    var pageType = 'unknown';
    if ({{environment}} === 'cms') {
      pageType = 'landing_page';
    }
    else if ({{pageType}} === 'root') {
    	pageType = 'home';	
    }
    else if ({{pageType}} === 'search') {
    	pageType = 'search';	
    }
    else if ({{pageType}} === 'after_sales') {
    	pageType = 'aftersales';	
    }
    else if ({{pageType}} === 'book_redirect') {
    	pageType = 'transfer';	
    }
    else if ({{pageType}} === 'hotel_transfer') {
    	pageType = 'hotel_transfer';	
    }
    else if ({{pageType}} === 'static') {
    	pageType = 'static';	
    }
    
    // generate new subsession_id on home or landing page
    if (pageType === 'home' || pageType === 'landing_page') {
      if (localeStorageEnabled()) {
        window.localStorage.removeItem("sp_ssid");
		window.localStorage.setItem("sp_ssid", generateUUID());
      }
    }
    // fallback uuid because undefined coming from locale storage would prevent event to make it through 
    var fallback = '00000000-0000-0000-0000-000000000000';
  
  	// track pageview with subsession_id and page_type contexts
  	snowplow('trackPageView', null, [
      {
      	schema: "iglu:com.goeuro/subsession_context/jsonschema/1-0-0",
        	data: {
            	subsession_id : window.localStorage.getItem("sp_ssid") || fallback
	        }
      }, {
        schema: 'iglu:com.goeuro/page_type_context/jsonschema/1-0-0',
          	data: {
           	 	page_type: pageType
      	  	}
      }
    ]);
*/
    
    _snaq('trackPageView');
        
    // backward compatibility for PHP desktop
    dataLayer.push({'event':'ROItelligence-doneLoadingST'});
        
  });

</script>
  
