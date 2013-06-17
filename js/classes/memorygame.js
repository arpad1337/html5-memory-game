/*
 *	@name classes/item.js
 *  @author Árpád Kiss
 *	@require interface.js, item.js
 */

var MemoryGame = (function() {

	// private static
	var _created = false;
	var _clicks, _matches,
		_container, _d, _di, _b, _p, _lastElement,
		_userInteractions,
		_width, _height;
		_ticker = null;
	return function(container, options) {

		// constructor
		if (_created) throw new Error('MemoryGame: only one instance is allowed.');
		_created = true;

		if (Item === undefined) throw new Error('MemoryGame: Item class is missing.');

		if (options.tiles.items === undefined || options.tiles.items.length === 0) throw new Error('MemoryGame: tiles are not defined or has zero length.');
		if (document.getElementById(container) === undefined) throw new Error('MemoryGame: conatiner [memoryGame] not found.');

		if(options.ticker) _ticker = document.getElementById(options.ticker);

		_width = options.itemWidth || 120;
		_height = options.itemHeight || 120;

		_container = document.getElementById(container);
		_d = document.createElement('div');
		_d.style.minWidth = _width + 'px';
		_d.style.minHeight = _height + 'px';
		_d.setAttribute('class', 'item-holder');

		_di = document.createElement('div');
		_di.classList.add('item');
		_di.style.width = _width + 'px';
		_di.style.height = _height + 'px';
		_b = document.createElement('div');
		_b.classList.add('front');
		_b.style.width = _width + 'px';
		_b.style.height = _height + 'px';
		_di.appendChild(_b);

		_d.appendChild(_di);

		var _order = [];

		var _start, _items = [],
			_counter, _miliseconds = 0;
		var j = 0;
		for (var i = 0; i < options.tiles.items.length; i++) {
			_items[j] = new Item(i, 'img/' + options.tiles.items[i] + '.' + ((options.tiles.type) ? options.tiles.type : 'png'), _width, _height);
			j++;
			_items[j] = new Item(i, 'img/' + options.tiles.items[i] + '.' + ((options.tiles.type) ? options.tiles.type : 'png'), _width, _height);
			j++;
			_container.appendChild(_d.cloneNode(true));
			_container.appendChild(_d.cloneNode(true));
		}

		// private
		var _startTimer = function() {
			_start = new Date();
			if(_ticker) {
				if(_counter) clearInterval(_counter);
				_counter = setInterval(function() {
					_ticker.innerHTML = Number((new Date() - _start) / 1000).toFixed(2) + " ms";
				}, 10);
			}
			return "Timer started";
		};

		var _stopTimer = function() {
			_miliseconds = new Date() - _start;
			if(_ticker) clearInterval(_counter); _counter = null;
			return "Timer stoped: " + _miliseconds;
		};

		var _drawScene = function() {
			Interface.ensureImplements(_items[0], ItemInterface);
			for (var i = 0; i < options.tiles.items.length << 1; i++) {
				_order.push(_items[i].getID());
				_container.children[i].className = 'item-holder';
				_container.children[i].children[0].appendChild(_items[i].toString());
				if(!_container.children[i].addEventListener) {
					_container.children[i].detachEvent('onclick',_onItemClick);
					_container.children[i].attachEvent('onclick', _onItemClick);
				}
				else {
					_container.children[i].removeEventListener('click', _onItemClick);
					_container.children[i].addEventListener('click', _onItemClick);
				}
			}
		};

		var _getNodeDeep = function(node,className)
		{
			if(node.className == className) {
				return node;
			} else {
				return _getNodeDeep(node.parentNode,className);
			}
		};

		var _onItemClick = function() {
			var element = null;
			if(this.className && this.className.indexOf('item-holder') != -1) {
				element = this;
			} else {
				element = _getNodeDeep(window.event.srcElement,'item-holder');
			}

			if(_lastElement.length > 0 && element.children[0].children[1].getAttribute('data-instance') == _lastElement[_lastElement.length - 1].children[1].getAttribute('data-instance')) return;

			_clicks++;

			if (_clicks > 2) {
				_lastElement.pop().children[1].flop();
				_lastElement.pop().children[1].flop();
				_lastElement = [];
				_clicks = 1;

			}
			element.children[0].children[1].flip();
			element.children[0].event = arguments[0];

			if (_lastElement.length > 0 && element.children[0].children[1].getAttribute('data-id') == _lastElement[_lastElement.length - 1].children[1].getAttribute('data-id') && element.children[0].children[1].getAttribute('data-instance') != _lastElement[_lastElement.length - 1].children[1].getAttribute('data-instance')) {

				_matches++;

				_userInteractions.push({
					id: element.children[0].getAttribute('data-id'),
					items: [{
						x: _lastElement[_lastElement.length - 1].event.clientX,
						y: _lastElement[_lastElement.length - 1].event.clientY,
						time: _lastElement[_lastElement.length - 1].event.timeStamp
					}, {
						x: arguments[0].offsetX,
						y: arguments[0].offsetY,
						time: new Date().getTime()
					}]
				});

				if (_matches == options.tiles.items.length) {
					console.log(_stopTimer());
					// Custom event
					var gameOver = null;

					var detail = {
						message: "Congratulation!",
						userInteractions: _userInteractions,
						offset: {
							top: _container.offsetTop,
							left: _container.offsetLeft
						},
						container: {
							width: _container.offsetWidth,
							heigth: _container.offsetHeight
						},
						item: {
							size: {
								width: _width,
								height: _height
							}
						},
						order: _order,
						miliseconds: _miliseconds
					};

					if(window.CustomEvent) {
						gameOver = new CustomEvent(
							'gameOver', {
							detail: detail,
							bubbles: true,
							cancelable: false
						});
						_container.dispatchEvent(gameOver);
					} else {
						gameOver = document.createEventObject();
						gameOver.detail = detail;
						gameOver.customEvent = true;
						_container.fireEvent('onpropertychange',gameOver);
					}
				}
				if(!_lastElement[_lastElement.length - 1].parentNode.removeEventListener) {
					_lastElement[_lastElement.length - 1].parentNode.detachEvent('onclick',_onItemClick);
					element.detachEvent('onclick',_onItemClick);
				} else {
					_lastElement[_lastElement.length - 1].parentNode.removeEventListener('click', _onItemClick);
					element.removeEventListener('click', _onItemClick);
				}

				_clicks = 0;
				_lastElement = [];
			} else {
				_lastElement.push(element.children[0]);
			}
		};

		// public
		this.startGame = function() {
			_lastElement = [];
			_userInteractions = [];
			_matches = 0;
			_clicks = 0;
			_items.shuffle();
			_drawScene();
			console.log(_startTimer());
		};

		this.onGameOver = function(callback)
		{
			if(!_container.addEventListener) {
				_container.attachEvent('onpropertychange', function(){
					if(arguments[0].customEvent)
					{
						callback.call(this,arguments[0]);
					}
				});
			} else {
				_container.addEventListener('gameOver', callback);
			}
		};

		// getters
		this.getMiliseconds = function() {
			return _miliseconds;
		};

		this.getItems = function() {
			return _items;
		};

		this.getContainer = function() {
			return _container;
		};

		console.log("MemoryGame initialized.");
	};
})();


var shuffle = function(b) {
	var i = this.length,
		j, t;
	while (i) {
		j = Math.floor((i--) * Math.random());
		t = b && typeof this[i].shuffle !== 'undefined' ? this[i].shuffle() : this[i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
};
var defineProperty = (typeof Object.defineProperty == 'function');
if (defineProperty) {
	try {
		Object.defineProperty(Array.prototype, 'shuffle', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: shuffle
		});
	} catch (e) {}
}
if (!Array.prototype.shuffle) Array.prototype.shuffle = shuffle;