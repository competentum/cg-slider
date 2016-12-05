/*!
 * cg-slider v0.0.1 - Accessible Slider Component
 * 
 * (c) 2015-2016 Competentum Group | http://competentum.com
 * Released under the MIT license
 * https://opensource.org/licenses/mit-license.php
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CgSlider"] = factory();
	else
		root["CgSlider"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(2);

	var _events = __webpack_require__(6);

	var _events2 = _interopRequireDefault(_events);

	var _merge = __webpack_require__(7);

	var _merge2 = _interopRequireDefault(_merge);

	var _utils = __webpack_require__(9);

	var _utils2 = _interopRequireDefault(_utils);

	var _helpFuncs = __webpack_require__(10);

	var _helpFuncs2 = _interopRequireDefault(_helpFuncs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	/**
	 * Slider's customizing settings
	 * @typedef {Object} SliderSettings
	 * @property {Element|string} container - DOM Element or element id in which slider should be rendered.
	 *                                        This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
	 * @property {number|number[]} initialValue - Value which will be set on initialization.
	 * @property {boolean} isRange - If true two sliders will be added to set range.
	 * @property {number} min - Minimum slider value.
	 * @property {number} max - Maximum slider value.
	 * @property {number} step
	 * @property {number|number[]} tabindex - tabindex of handle element. It can be array of two numbers for range slider.
	 */

	var SLIDER_CLASS = 'cg-slider';
	var RANGE_CLASS = SLIDER_CLASS + '-range';
	var SLIDER_BG = SLIDER_CLASS + '-bg';
	var PROGRESS_CLASS = SLIDER_CLASS + '-progress';
	var HANDLE_CLASS = SLIDER_CLASS + '-handle';
	var MIN_HANDLE_CLASS = SLIDER_CLASS + '-handle-min';
	var MAX_HANDLE_CLASS = SLIDER_CLASS + '-handle-max';

	var CgSlider = function (_EventEmitter) {
	  _inherits(CgSlider, _EventEmitter);

	  _createClass(CgSlider, null, [{
	    key: '_fixSetting',
	    value: function _fixSetting(name, setting) {
	      var constructor = this; // without this declaration IDE will highlight static variables as error

	      switch (name) {
	        case 'tabindex':
	          if (typeof setting === 'number') {
	            setting = [setting, setting];
	          } else if (Array.isArray(setting)) {
	            if (setting.length > 2) {
	              setting.length = 2;
	            } else {
	              while (setting.length < 2) {
	                setting.push(setting[0] || constructor.DEFAULT_SETTINGS.tabindex[0]);
	              }
	            }
	          }
	          break;

	        default:
	          break;
	      }
	      return setting;
	    }

	    /**
	     * Fixes settings object.
	     * @param {SliderSettings} settings
	     * @returns {SliderSettings}
	     * @private
	     */

	  }, {
	    key: '_fixSettings',
	    value: function _fixSettings(settings) {
	      for (var name in settings) {
	        if (settings.hasOwnProperty(name)) {
	          settings[name] = this._fixSetting(name, settings[name]);
	        }
	      }

	      if (settings.initialValue === null) {
	        settings.initialValue = settings.isRange ? [settings.min, settings.min + settings.step] : settings.min;
	      }

	      return settings;
	    }

	    /**
	     *
	     * @param {SliderSettings} settings
	     */

	  }, {
	    key: 'DEFAULT_SETTINGS',


	    /**
	     *
	     * @returns {SliderSettings}
	     * @constructor
	     */
	    get: function get() {
	      if (!this._DEFAULT_SETTINGS) {
	        this._DEFAULT_SETTINGS = {
	          initialValue: null,
	          isRange: false,
	          min: 0,
	          max: 100,
	          step: 1,
	          tabindex: [0, 0]
	        };
	      }
	      return this._DEFAULT_SETTINGS;
	    }
	  }, {
	    key: 'EVENTS',
	    get: function get() {
	      if (!this._EVENTS) {
	        this._EVENTS = {
	          CHANGE: 'change',
	          START_CHANGE: 'start_change',
	          STOP_CHANGE: 'stop_change'
	        };
	      }
	      return this._EVENTS;
	    }
	  }]);

	  function CgSlider(settings) {
	    _classCallCheck(this, CgSlider);

	    var _this = _possibleConstructorReturn(this, (CgSlider.__proto__ || Object.getPrototypeOf(CgSlider)).call(this));

	    _this._applySettings(settings);
	    _this._render();
	    _this._addListeners();
	    _this._setValue(_this.initialValue, true);
	    return _this;
	  }

	  /**
	   * DOM Element which contains slider.
	   * @returns {Element}
	   */


	  _createClass(CgSlider, [{
	    key: 'setSetting',


	    /**
	     *
	     * @param {string} name
	     * @param {*} val
	     */
	    value: function setSetting(name, val) {
	      val = this.constructor._fixSetting(name, val);

	      switch (name) {
	        case 'min':
	        case 'max':
	        case 'step':
	          //todo: redraw
	          this._settings[name] = val;
	          break;

	        case 'isRange':
	          //todo: if it different move to setter
	          this._settings.isRange = !!val;

	          break;

	        case 'tabindex':
	          this.tabindex = val;
	          break;

	        default:
	          throw new Error(this.constructor.name + ' setSetting error: passed setting \'' + name + '\' is not supported.');
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_addListeners',
	    value: function _addListeners() {
	      this._makeDraggable();
	      this._addKeyboardListeners();
	    }
	  }, {
	    key: '_addKeyboardListeners',
	    value: function _addKeyboardListeners() {
	      //todo:
	    }
	  }, {
	    key: '_makeDraggable',
	    value: function _makeDraggable() {
	      var self = this;
	      this._minHandleElement.addEventListener('mousedown', onmousedown);
	      this._maxHandleElement.addEventListener('mousedown', onmousedown);

	      var dragData = {
	        startHandlePos: null,
	        startMousePos: null,
	        dragHandle: null,
	        containerWidth: null
	      };

	      function onmousedown(e) {
	        _utils2.default.extendEventObject(e);

	        dragData.dragHandle = this;
	        dragData.isMaxHandle = _utils2.default.hasClass(this, MAX_HANDLE_CLASS);
	        dragData.containerWidth = self._handlesContainer.getBoundingClientRect().width;
	        dragData.startHandlePos = _helpFuncs2.default.getHandlePosition(this, self._handlesContainer);
	        dragData.startMousePos = {
	          x: e.px,
	          y: e.py
	        };

	        document.addEventListener('mousemove', onmousemove);
	        document.addEventListener('mouseup', onmouseup);
	      }

	      function onmousemove(e) {
	        _utils2.default.extendEventObject(e);

	        var percent = _helpFuncs2.default.getPercent(dragData.startHandlePos.x + e.px - dragData.startMousePos.x, dragData.containerWidth);

	        var value = _helpFuncs2.default.calcValueByPercent(percent, self.min, self.max);

	        self.value = dragData.isMaxHandle ? value : [value, self.value[1]];
	      }

	      function onmouseup(e) {
	        _utils2.default.extendEventObject(e);
	        document.removeEventListener('mousemove', onmousemove);
	        document.removeEventListener('mouseup', onmouseup);

	        // clear dragData
	        for (var key in dragData) {
	          if (dragData.hasOwnProperty(key)) {
	            dragData[key] = null;
	          }
	        }
	      }
	    }

	    /**
	     * Fixes and sets settings on initialization.
	     * @param {SliderSettings} settings
	     * @private
	     */

	  }, {
	    key: '_applySettings',
	    value: function _applySettings(settings) {
	      var DEFAULT_SETTINGS = this.constructor.DEFAULT_SETTINGS;

	      settings = (0, _merge2.default)({}, DEFAULT_SETTINGS, settings);
	      this.constructor._fixSettings(settings);

	      /** @type SliderSettings */
	      this._settings = {};

	      //
	      if (settings.container instanceof Element) {
	        this._container = settings.container;
	      } else if (typeof settings.container === 'string') {
	        this._container = document.getElementById(settings.container);
	        if (!this.container) {
	          throw new Error(this.constructor.name + ' initialization error: can not find element with id "' + settings.container + '".');
	        }
	      } else if (typeof settings.container === 'undefined') {
	        //todo: create container
	        this._container = document.createElement('div');
	      } else {
	        throw new Error(this.constructor.name + ' initialization error: type of "settings.container" property is unsupported.');
	      }
	      delete settings.container;

	      // call setters for settings which defined in DEFAULT_SETTINGS only
	      for (var key in DEFAULT_SETTINGS) {
	        if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
	          this[key] = settings[key];
	        }
	      }
	    }

	    /**
	     * @private
	     */

	  }, {
	    key: '_render',
	    value: function _render() {
	      var rootClasses = [SLIDER_CLASS];

	      if (this.isRange) {
	        rootClasses.push(RANGE_CLASS);
	      }

	      var elementHTML = '\n      <div class="' + rootClasses.join(' ') + '">\n        <div class="' + SLIDER_BG + '">\n          <div class="' + PROGRESS_CLASS + '"></div>\n          <div class="' + HANDLE_CLASS + ' ' + MIN_HANDLE_CLASS + '" tabindex="' + this.tabindex[0] + '"></div>\n          <div class="' + HANDLE_CLASS + ' ' + MAX_HANDLE_CLASS + '" tabindex="' + this.tabindex[1] + '"></div>\n        </div>\n      </div>\n    ';

	      this._rootElement = _utils2.default.createHTML(elementHTML);
	      this._progressElement = this._rootElement.querySelector('.' + PROGRESS_CLASS);
	      this._handlesContainer = this._rootElement.querySelector('.' + SLIDER_BG);
	      this._minHandleElement = this._handlesContainer.querySelector('.' + MIN_HANDLE_CLASS);
	      this._maxHandleElement = this._handlesContainer.querySelector('.' + MAX_HANDLE_CLASS);

	      this.container.appendChild(this._rootElement);

	      // todo: remove this code when interactive will be added
	      //this._progressElement.style.width = '50%';
	      //this._maxHandleElement.style.left = '50%';
	    }
	  }, {
	    key: '_setValue',
	    value: function _setValue(val, force) {
	      if (typeof val !== 'number' && !Array.isArray(val)) {
	        throw new Error(this.constructor.name + ' set value error: passed value\'s (' + val + ') type is not supported.');
	      }

	      // for not range slider value can be number
	      if (typeof val === 'number') {
	        var minVal = this._value && this._value[0] || this.min;
	        val = [minVal, val];
	      }

	      val.sort(function (a, b) {
	        return a - b;
	      });
	      val = _helpFuncs2.default.fixValue(val, this.min, this.max, this.step);
	      //todo: get stepped value

	      var valueChanged = typeof this._value === 'undefined' || this._value[0] !== val[0] || this._value[1] !== val[1];

	      this._value = val;

	      if (valueChanged || force) {
	        var minPercentVal = _helpFuncs2.default.getPercent(val[0], this.max);
	        var maxPercentVal = _helpFuncs2.default.getPercent(val[1], this.max);
	        this._minHandleElement.style.left = minPercentVal + '%';
	        this._maxHandleElement.style.left = maxPercentVal + '%';
	        this._progressElement.style.left = minPercentVal + '%';
	        this._progressElement.style.width = maxPercentVal - minPercentVal + '%';
	        this.emit(this.constructor.EVENTS.CHANGE, this.value);
	      }
	    }
	  }, {
	    key: 'container',
	    get: function get() {
	      return this._container;
	    }

	    /**
	     *
	     * @returns {boolean}
	     */

	  }, {
	    key: 'isRange',
	    get: function get() {
	      return this._settings.isRange;
	    }

	    /**
	     *
	     * @param {boolean} val
	     */
	    ,
	    set: function set(val) {
	      this.setSetting('isRange', val);
	    }

	    /**
	     *
	     * @returns {number}
	     */

	  }, {
	    key: 'min',
	    get: function get() {
	      return this._settings.min;
	    }

	    /**
	     *
	     * @param {number} val
	     */
	    ,
	    set: function set(val) {
	      this.setSetting('min', val);
	    }

	    /**
	     *
	     * @returns {number}
	     */

	  }, {
	    key: 'max',
	    get: function get() {
	      return this._settings.max;
	    }

	    /**
	     *
	     * @param {number} val
	     */
	    ,
	    set: function set(val) {
	      this.setSetting('max', val);
	    }

	    /**
	     *
	     * @returns {number}
	     */

	  }, {
	    key: 'step',
	    get: function get() {
	      return this._settings.step;
	    }

	    /**
	     *
	     * @param {number} val
	     */
	    ,
	    set: function set(val) {
	      this.setSetting('step', val);
	    }

	    /**
	     *
	     * @returns {number[]}
	     */

	  }, {
	    key: 'tabindex',
	    get: function get() {
	      return this._settings.tabindex;
	    }

	    /**
	     *
	     * @param {number[]} val
	     */
	    ,
	    set: function set(val) {
	      val = this.constructor._fixSetting('tabindex', val);
	      this._settings.tabindex = val;
	      if (this._minHandleElement) {
	        this._minHandleElement.setAttribute('tabindex', this._settings.tabindex[0]);
	      }
	      if (this._maxHandleElement) {
	        this._maxHandleElement.setAttribute('tabindex', this._settings.tabindex[1]);
	      }
	    }

	    /**
	     *
	     * @returns {number|number[]}
	     */

	  }, {
	    key: 'value',
	    get: function get() {
	      return this.isRange ? this._value : this._value[1];
	    }

	    /**
	     *
	     * @param {number|number[]} val
	     */
	    ,
	    set: function set(val) {
	      this._setValue(val);
	    }
	  }]);

	  return CgSlider;
	}(_events2.default);

	module.exports = CgSlider;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/less-loader/index.js!./common.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/postcss-loader/index.js!./../node_modules/less-loader/index.js!./common.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".cg-slider {\n  padding: 6px;\n  position: relative;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.cg-slider .cg-slider-bg {\n  height: 6px;\n  background: #aaaaaa;\n  position: relative;\n}\n.cg-slider .cg-slider-progress {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background: #17AC5B;\n}\n.cg-slider .cg-slider-handle {\n  top: 50%;\n  left: 0;\n  border-radius: 50%;\n  position: absolute;\n  height: 18px;\n  width: 18px;\n  background: #17AC5B;\n  cursor: pointer;\n  margin-left: -9px;\n  margin-top: -9px;\n}\n.cg-slider .cg-slider-handle:before,\n.cg-slider .cg-slider-handle:after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  border-radius: 50%;\n}\n.cg-slider .cg-slider-handle:after {\n  transition: left 0.3s, right 0.3s, bottom 0.3s, top 0.3s;\n}\n.cg-slider .cg-slider-handle:before,\n.cg-slider .cg-slider-handle:hover:after,\n.cg-slider .cg-slider-handle:active:after {\n  left: -4px;\n  right: -4px;\n  bottom: -4px;\n  top: -4px;\n}\n.cg-slider .cg-slider-handle:hover:after,\n.cg-slider .cg-slider-handle:active:after {\n  background: #17AC5B;\n}\n.cg-slider .cg-slider-handle:focus {\n  outline: none;\n}\n.cg-slider .cg-slider-handle:focus:before {\n  background-color: rgba(23, 172, 91, 0.4);\n}\n.cg-slider .cg-slider-handle-min {\n  display: none;\n}\n.cg-slider.cg-slider-range .cg-slider-handle-min {\n  display: block;\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	// Polyfills

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	if (!Element.prototype.matches) {
	  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
	    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
	        i = matches.length;
	    while (--i >= 0 && matches.item(i) !== this) {
	      // empty
	    }
	    return i > -1;
	  };
	}

	exports.default = {

	  /**
	   *
	   * @param {Element} element
	   * @param {string} className
	   */
	  addClass: function addClass(element, className) {
	    var re = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
	    if (re.test(element.className)) return;
	    element.className = (element.className + ' ' + className).replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
	  },

	  /**
	   *
	   * @param {Element} element
	   * @param {string} className
	   * @returns {boolean}
	   */
	  hasClass: function hasClass(element, className) {
	    return element.matches('.' + className);
	  },

	  /**
	   *
	   * @param {Element} element
	   * @param {string} className
	   */
	  removeClass: function removeClass(element, className) {
	    var re = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
	    element.className = element.className.replace(re, '$1').replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
	  },

	  /**
	   * Removes current node from tree.
	   * @param {Node} node
	   */
	  removeNode: function removeNode(node) {
	    if (node.parentNode) node.parentNode.removeChild(node);
	  },

	  /**
	   *
	   * @param {string} html
	   * @returns {Node}
	   */
	  createHTML: function createHTML(html) {
	    var div = document.createElement('div');
	    div.innerHTML = html.trim();
	    return div.firstChild;
	  },

	  /**
	   * Adds coordinates to event object independently of event from touching or mouse. (cx, cy - client coordinates, px, py - page coordinates)
	   * @param event
	   */
	  extendEventObject: function extendEventObject(event) {
	    if (event.touches && event.touches[0]) {
	      event.cx = event.touches[0].clientX;
	      event.cy = event.touches[0].clientY;
	      event.px = event.touches[0].pageX;
	      event.py = event.touches[0].pageY;
	    } else if (event.changedTouches && event.changedTouches[0]) {
	      event.cx = event.changedTouches[0].clientX;
	      event.cy = event.changedTouches[0].clientY;
	      event.px = event.changedTouches[0].pageX;
	      event.py = event.changedTouches[0].pageY;
	    } else {
	      event.cx = event.clientX;
	      event.cy = event.clientY;
	      event.px = event.pageX;
	      event.py = event.pageY;
	    }
	  }
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {

	  /**
	   *
	   * @param {number} percent
	   * @param {number} min
	   * @param {number} max
	   * @returns {number}
	   */
	  calcValueByPercent: function calcValueByPercent(percent, min, max) {
	    return min + (max - min) * percent / 100;
	  },

	  /**
	   *
	   * @param {number[]} value
	   * @param {number} min
	   * @param {number} max
	   * @param {number} step
	   * @returns {number[]}
	   */
	  fixValue: function fixValue(value, min, max, step) {
	    for (var i = 0; i < value.length; i++) {
	      var val = Math.max(min, Math.min(max, value[i]));
	      //find nearest stepped value
	      var steps = (val - min) / step;
	      var leftSteppedVal = min + Math.floor(steps) * step;
	      var rightSteppedVal = min + Math.ceil(steps) * step;
	      var leftDiff = Math.abs(leftSteppedVal - val);
	      var rightDiff = Math.abs(rightSteppedVal - val);

	      value[i] = rightDiff <= leftDiff ? rightSteppedVal : leftSteppedVal;
	    }
	    return value;
	  },

	  /**
	   * Returns position of the handle's center in container.
	   * @param {Element} handleElement
	   * @param {Element} container
	   * @returns {{x: number, y: number}}
	   */
	  getHandlePosition: function getHandlePosition(handleElement, container) {
	    container = container || handleElement.parentElement;

	    var bounds = handleElement.getBoundingClientRect();
	    var containerBounds = container.getBoundingClientRect();

	    return {
	      x: (bounds.left + bounds.right) / 2 - containerBounds.left,
	      y: (bounds.top + bounds.bottom) / 2 - containerBounds.top
	    };
	  },

	  getPercent: function getPercent(val, max) {
	    return Math.min(100, Math.max(0, 100 * val / max));
	  }
	};

/***/ }
/******/ ])
});
;