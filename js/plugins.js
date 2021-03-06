// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
  (function() {
    var noop = function() {};
    var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
    var length = methods.length;
    var console = window.console = {};
    while (length--) {
      console[methods[length]] = noop;
    }
  }());
}

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

  (function(view) {

    "use strict";

    if (!('HTMLElement' in view) && !('Element' in view)) return;

    var
    classListProp = "classList",
      protoProp = "prototype",
      elemCtrProto = (view.HTMLElement || view.Element)[protoProp],
      objCtr = Object,
      strTrim = String[protoProp].trim || function() {
        return this.replace(/^\s+|\s+$/g, "");
      }, arrIndexOf = Array[protoProp].indexOf || function(item) {
        var
        i = 0,
          len = this.length;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      ,
      DOMEx = function(type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }, checkTokenAndGetIndex = function(classList, token) {
        if (token === "") {
          throw new DOMEx(
            "SYNTAX_ERR", "An invalid or illegal string was specified");
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
            "INVALID_CHARACTER_ERR", "String contains an invalid character");
        }
        return arrIndexOf.call(classList, token);
      }, ClassList = function(elem) {
        var
        trimmedClasses = strTrim.call(elem.className),
          classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
          i = 0,
          len = classes.length;
        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function() {
          elem.className = this.toString();
        };
      }, classListProto = ClassList[protoProp] = [],
      classListGetter = function() {
        return new ClassList(this);
      };
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function(i) {
      return this[i] || null;
    };
    classListProto.contains = function(token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function() {
      var
      tokens = arguments,
        i = 0,
        l = tokens.length,
        token, updated = false;
      do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
          this.push(token);
          updated = true;
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.remove = function() {
      var
      tokens = arguments,
        i = 0,
        l = tokens.length,
        token, updated = false;
      do {
        token = tokens[i] + "";
        var index = checkTokenAndGetIndex(this, token);
        if (index !== -1) {
          this.splice(index, 1);
          updated = true;
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.toggle = function(token, forse) {
      token += "";

      var
      result = this.contains(token),
        method = result ? forse !== true && "remove" : forse !== false && "add";

      if (method) {
        this[method](token);
      }

      return result;
    };
    classListProto.toString = function() {
      return this.join(" ");
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
        get: classListGetter,
        enumerable: true,
        configurable: true
      };
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

  }(window));

}

// Place any jQuery/helper plugins in here.