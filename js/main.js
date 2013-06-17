var Config = {
	memoryGame: {
		tiles: {
			items: [
				"tiles/logo_tiles0000"//,
				// "tiles/logo_tiles0001",
				// "tiles/logo_tiles0002",
				// "tiles/logo_tiles0003",
				// "tiles/logo_tiles0004",
				// "tiles/logo_tiles0005",
				// "tiles/logo_tiles0006",
				// "tiles/logo_tiles0007",
				// "tiles/logo_tiles0008",
				// "tiles/logo_tiles0009",
				// "tiles/logo_tiles0010",
				// "tiles/logo_tiles0011"
			],
			type: 'png'
		},
		itemWidth: 120,
		itemHeight: 120,
		ticker: 'tick'
	},
	baseUri: "ajax.php"
};

var SupershopApp = (function() {
	var _created = false;
	var _userObject = null;
	var _baseUri = "";
	return function(newBaseUri) {
		if (_created) throw new Error('SupershopApp: only one instance is allowed.');
		_created = true;
		if(newBaseUri === undefined) throw new Error('SupershopApp: baseUri is undefined.');
		_baseUri = newBaseUri;
		var _game = new MemoryGame('memoryGame', Config.memoryGame);

		this.startGame = function() {
			_game.startGame();
		};

		var _sendMessage = function(action, data, callback) {
			var asyncRequest = (function() {
				var handleReadyState = function(o, callback) {
					var poll = window.setInterval(

					function() {
						if (o && o.readyState == 4) {
							window.clearInterval(poll);
							if (callback) {
								callback(JSON.parse(o.responseText));
							}
						}
					},
					50);
				};

				var serialize = function(obj, prefix) {
					var str = [];
					for (var p in obj) {
						var k = prefix ? prefix + "[" + p + "]" : p,
							v = obj[p];
						str.push(typeof v == "object" ? serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
					}
					return str.join("&");
				};

				var getXHR = function() {
					var http;
					try {
						http = new XMLHttpRequest();
						getXHR = function() {
							return new XMLHttpRequest();
						};
					} catch (e) {
						var msxml = [
							'MSXML2.XMLHTTP.3.0',
							'MSXML2.XMLHTTP',
							'Microsoft.XMLHTTP'];
						for (var i = 0, len = msxml.length; i < len; ++i) {
							try {
								http = new ActiveXObject(msxml[i]);
								getXHR = function() {
									return new ActiveXObject(msxml[i]);
								};
								break;
							} catch (e) {}
						}
					}
					return http;
				};
				return function(method, uri, callback, postData) {
					var params = (postData)?serialize(postData):null;
					var http = getXHR();
					http.open(method, uri, true);
					http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					handleReadyState(http, callback);
					http.send(params);
					return http;
				};
			})();
			asyncRequest('POST',_baseUri+'?action='+action,callback,data);
		};

		var _onGameOver = function() {
			console.log(arguments);
			console.log("Game over.");
			_sendMessage('sendAnswer',{detail: arguments[0].detail,timeStamp:arguments[0].timeStamp},function(){console.log(arguments[0]);});
		};

		_game.onGameOver(_onGameOver);

		console.log("App initialized.");
	};
})();

var App = new SupershopApp(Config.baseUri);