;
/*
DGCmedia Social Sharer V 1.0
http://www.dgcmedia.es

Clase JS para compartir de forma sencilla p�ginas (e im�genes) en las redes Facebook, Twitter y Pinterest

*/
var shareDGC = function(customConfig){
	var obj = {
		config : {
			likesId : '.dgcLikes', // Identificador para el elemento en el que mostrar los shares en Facebook
			tweetsId : '.dgcTweets', // Identificador para el elemento en el que mostrar los tweet en Twitter
			pingsId : '.dgcPings', // Identificador para el elemento en el que mostrar los pings en Pinterest
			plusId : '.dgcPlus', // Identificador para el elemento en el que mostrar los pings en G+
			pingImg : '#dgcPing, .dgcPing', // Identificador para compartir en pinterest
			shareFcbId : '.dgcFcbS', // Identificador para compartir en Facebook
			shareTwtId : '.dgcTwtS', // Identificador para compartir en Twitter
			sharePinId : '.dgcPinS', // Identificador para compartir en Pinterest
			sharePlusId : '.dgcPlusS', // Identificador para compartir en Pinterest
			dataUrl: 'su', // Identificador atributo data-XXXX para indicar una url espec�fica
			dataTitle: 'st', // Identificador atributo data-XXXX para indicar un texto espec�fico
			dataMedia: 'sm', // Identificador atributo data-XXXX para indicar una imagen espec�fica
			title : encodeURIComponent(document.title.replace('#!','').replace('#','')), // titulo (si no se indica)
			url : document.URL, // uri (si no se indica)
			runAuto : true // se lanza o no autom�ticamente
		},
		likes : function(element){
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			jQuery.ajax({
				url: 'http://graph.facebook.com/?id='+uri+'&callback=?',
				crossDomain : true,
				dataType : 'jsonp'
			}).done(function(data) {
				if((data.shares != 0) && (data.shares != undefined) && (data.shares != null)) { 
					element.html( data.shares );
				}
				else {
					element.html( 0 );
				}
			});
		},
		tweets : function(element){
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			jQuery.ajax({
				url: 'http://urls.api.twitter.com/1/urls/count.json?url='+uri+'&callback=?',
				crossDomain : true,
				dataType : 'jsonp'
			}).done(function(data) {
				if((data.count != 0) && (data.count != undefined) && (data.count != null)) { 
					element.html( data.count );
				}else {
					element.html( 0 );
				}
			});
		},
		pings : function(element){
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			
			jQuery.ajax({
				url: 'http://api.pinterest.com/v1/urls/count.json?url='+uri+'&callback=?',
				crossDomain : true,
				dataType : 'jsonp'
			}).done(function(data) {
				if((data.count != 0) && (data.count != undefined) && (data.count != null)) { 
					element.html( data.count );
				}else {
					element.html( 0 );
				}
			});
		},
		pluses : function(element){
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			var API_KEY = 'e733e3bd4fde09429c6d7f4fcf50ba999e53a4a8';
			jQuery.ajax({
				url: 'https://clients6.google.com/rpc?key='+API_KEY + 'callback=?',
				type: 'POST',
				data : {
					 "method":"pos.plusones.get",
					    "id":"p",
					    "params":{
					        "nolog":true,
					        "id": uri,
					        "source":"widget",
					        "userId":"@viewer",
					        "groupId":"@self"
					        },
					    "jsonrpc":"2.0",
					    "key": "p",
					    "apiVersion":"v1"
				},
				crossDomain : true,
				dataType : 'jsonp'
			}).done(function(data) {
				if(typeof data[0] == 'undefined' || typeof data[0].result.metadata.globalCounts.count == 'undefined'){
					element.html( 0 );
				}else{
					element.html( parseInt(data[0].result.metadata.globalCounts.count) );
				}
			});
		},
		facebookShare : function(element){
			element=jQuery(element);
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			window.open( 'https://www.facebook.com/sharer/sharer.php?u='+uri, "facebookWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
			return false;
		},
		twitterShare : function(element){
			element=jQuery(element);
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			var title=encodeURIComponent((element.data(config.dataTitle))?element.data(config.dataTitle):config.title);
			window.open( 'http://twitter.com/intent/tweet?text='+uri+' '+title, "twitterWindow", "height=380,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" ); 
			return false;
		},
		pinterestShare : function(element){
			element=jQuery(element);
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			var title=encodeURIComponent((element.data(config.dataTitle))?element.data(config.dataTitle):config.title);
			var media=(element.data(config.dataMedia))?element.data(config.dataMedia):(jQuery(config.pingImg).first().attr('src'));
			window.open( 'http://pinterest.com/pin/create/button/?url='+uri+'&media='+media+'&description='+title, "pinterestWindow", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
			return false;
		},
		plusShare : function(element){
			element=jQuery(element);
			var config=this.config;
			var uri=(element.data(config.dataUrl))?element.data(config.dataUrl):config.url;
			window.open( 'https://plus.google.com/share?url='+uri, "G+Window", "height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,location=0,scrollbars=0" );
			return false;
		},
		
		
		// Lanza autom�ticamente el plugin
		run : function(){
			var config = this.config;
			var $this=this;
			jQuery(document).ready(function(){
				jQuery($this.config.likesId).each(function(index,element){
					$this.likes(jQuery(element));
				});
				jQuery($this.config.tweetsId).each(function(index,element){
					$this.tweets(jQuery(element));
				});
				jQuery($this.config.pingsId).each(function(index,element){
					$this.pings(jQuery(element));
				});
				jQuery($this.config.plusId).each(function(index,element){
					$this.pluses(jQuery(element));
				});
				jQuery(config.shareFcbId).on('click',function(){
					$this.facebookShare(this);
				});
				jQuery(config.shareTwtId).on('click',function(){
					$this.twitterShare(this);
				});
				jQuery(config.sharePinId).on('click',function(){
					$this.pinterestShare(this);
				});
				jQuery(config.sharePlusId).on('click',function(){
					$this.plusShare(this);
				});
			});
		}
	};
	
	if(typeof customConfig != 'undefined') obj.config=jQuery.extend(obj.config, customConfig);
	if(obj.config.runAuto) obj.run();
	return obj;
};