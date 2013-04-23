/*
 *	@name classes/item.js
 *  @author Árpád Kiss
 *	@require interface.js
 */

var ItemInterface = new Interface('ItemInterface', ['toString']);

var Item = (function() {
	var _instance = 0;
	// defining constructor
	return function(newID, newImageUrl, newWidth, newHeight) {
		if (newID === undefined) throw new Error('Item: ID is undefined.');
		if (newImageUrl === undefined) throw new Error('Item: imageUrl is undefined.');
		if (newWidth === undefined) throw new Error('Item: width is undefined.');
		if (newHeight === undefined) throw new Error('Item: height is undefined.');
		var _ID = newID,
			_imageUrl = newImageUrl,
			_width = newWidth,
			_height = newHeight,
			_cInstance = _instance;
		_instance++;
		this.getID = function() {
			return _ID;
		};
		this.getImageUrl = function() {
			return _imageUrl;
		};
		this.getWidth = function() {
			return _width;
		};
		this.getHeight = function() {
			return _height;
		};

		this.getInstance = function() {
			return _cInstance;
		};

		var _img = new Image(newWidth, newHeight);
		_img.src = newImageUrl;
		_img.setAttribute( 'data-id', _ID );
		_img.classList.add( (Modernizr.csstransforms3d?'back3d':'back') );
		_img.setAttribute( 'data-instance', _cInstance );

		this.getImage = function() {
			return _img;
		};

		this.toString = function() {
			return this.getImage();
		};
	};
})();
Image.prototype.flip = function() {
	this.parentNode.parentNode.classList.add( (Modernizr.csstransforms3d?'active3d':'active') );
	//chaining the object
	return this;
};
Image.prototype.flop = function() {
	this.parentNode.parentNode.classList.remove( (Modernizr.csstransforms3d?'active3d':'active') );
	//chaining the object
	return this;
};
Image.prototype.toItem = function() {
	return new Item(this.getAttribute('data-id'), this.getAttribute('src'), this.style.width, this.style.height);
};