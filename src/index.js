'use strict';

import './common.less';

import EventEmitter from 'events';
import keycode from 'keycode';
import merge from 'merge';
import utils from 'cg-component-utils';
import helpFuncs from './help-funcs';

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

const SLIDER_CLASS = 'cg-slider';
const RANGE_CLASS = `${SLIDER_CLASS}-range`;
const SLIDER_BG = `${SLIDER_CLASS}-bg`;
const PROGRESS_CLASS = `${SLIDER_CLASS}-progress`;
const HANDLE_CLASS = `${SLIDER_CLASS}-handle`;
const MIN_HANDLE_CLASS = `${SLIDER_CLASS}-handle-min`;
const MAX_HANDLE_CLASS = `${SLIDER_CLASS}-handle-max`;

class CgSlider extends EventEmitter {

  /**
   * Default instance settings.
   * @type SliderSettings
   */
  static DEFAULT_SETTINGS = {
    initialValue: null,
    isRange: false,
    min: 0,
    max: 100,
    step: 1,
    tabindex: [0, 0]
  };

  /**
   * Events which can be emitted.
   * @type {{CHANGE: string, START_CHANGE: string, STOP_CHANGE: string}}
   */
  static EVENTS = {
    CHANGE: 'change',
    START_CHANGE: 'start_change',
    STOP_CHANGE: 'stop_change'
  };

  static _fixSetting(name, setting) {
    const constructor = this; // without this declaration IDE will highlight static variables as error

    switch (name) {
      case 'tabindex':
        if (typeof setting === 'number') {
          setting = [setting, setting];
        }
        else if (Array.isArray(setting)) {
          if (setting.length > 2) {
            setting.length = 2;
          }
          else {
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
  static _fixSettings(settings) {
    for (let name in settings) {
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
  constructor(settings) {
    super();

    this._applySettings(settings);
    this._render();
    this._addListeners();
    this._setValue(this.initialValue, true);
  }

  /**
   * DOM Element which contains slider.
   * @returns {Element}
   */
  get container() {
    return this._container;
  }

  /**
   *
   * @returns {boolean}
   */
  get isRange() {
    return this._settings.isRange;
  }

  /**
   *
   * @param {boolean} val
   */
  set isRange(val) {
    this.setSetting('isRange', val);
  }

  /**
   *
   * @returns {number}
   */
  get min() {
    return this._settings.min;
  }

  /**
   *
   * @param {number} val
   */
  set min(val) {
    this.setSetting('min', val);
  }

  /**
   *
   * @returns {number}
   */
  get max() {
    return this._settings.max;
  }

  /**
   *
   * @param {number} val
   */
  set max(val) {
    this.setSetting('max', val);
  }

  /**
   *
   * @returns {number}
   */
  get step() {
    return this._settings.step;
  }

  /**
   *
   * @param {number} val
   */
  set step(val) {
    this.setSetting('step', val);
  }

  /**
   *
   * @returns {number[]}
   */
  get tabindex() {
    return this._settings.tabindex;
  }

  /**
   *
   * @param {number[]} val
   */
  set tabindex(val) {
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
  get value() {
    return this.isRange ? this._value : this._value[1];
  }

  /**
   *
   * @param {number|number[]} val
   */
  set value(val) {
    if (Array.isArray(val)) {
      val.sort((a, b) => a - b);
    }
    this._setValue(val);
  }

  /**
   *
   * @param {string} name
   * @param {*} val
   */
  setSetting(name, val) {
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
        throw new Error(`${this.constructor.name} setSetting error: passed setting '${name}' is not supported.`);
    }
  }

  /**
   * @private
   */
  _addListeners() {
    this._makeDraggable();
    this._addKeyboardListeners();
  }

  _addKeyboardListeners() {
    //todo:
  }

  _makeDraggable() {
    const self = this;
    this._minHandleElement.addEventListener('mousedown', onmousedown);
    this._maxHandleElement.addEventListener('mousedown', onmousedown);
    this._minHandleElement.addEventListener('keydown', onkeydown);
    this._maxHandleElement.addEventListener('keydown', onkeydown);

    var dragData = {
      startHandlePos: null,
      startMousePos: null,
      dragHandle: null,
      containerWidth: null
    };

    //todo: move handlers to prototype
    function onmousedown(e) {
      utils.extendEventObject(e);

      dragData.dragHandle = this;
      dragData.isMaxHandle = utils.hasClass(this, MAX_HANDLE_CLASS);
      dragData.containerWidth = self._handlesContainer.getBoundingClientRect().width;
      dragData.startHandlePos = helpFuncs.getHandlePosition(this, self._handlesContainer);
      dragData.startMousePos = {
        x: e.px,
        y: e.py
      };

      document.addEventListener('mousemove', onmousemove);
      document.addEventListener('mouseup', onmouseup);
    }

    function onmousemove(e) {
      utils.extendEventObject(e);

      const percent = helpFuncs.getPercent(dragData.startHandlePos.x + e.px - dragData.startMousePos.x, dragData.containerWidth);

      var value = helpFuncs.calcValueByPercent(percent, self.min, self.max);

      value = dragData.isMaxHandle ? value : [value, self.value[1]];
      self._setValue(value);
      //todo: emit start change event

      e.preventDefault();
    }

    function onmouseup(e) {
      utils.extendEventObject(e);
      document.removeEventListener('mousemove', onmousemove);
      document.removeEventListener('mouseup', onmouseup);

      // clear dragData
      for (let key in dragData) {
        if (dragData.hasOwnProperty(key)) {
          dragData[key] = null;
        }
      }
      //todo: emit stop change event

      e.preventDefault();
    }

    function onkeydown(e) {
      const isMaxHandle = utils.hasClass(this, MAX_HANDLE_CLASS);
      var newVal;

      switch (keycode(e)) {
        case 'home':
        case 'page down':
          newVal = isMaxHandle ? self.min : [self.min, self._value[1]];
          break;

        case 'end':
        case 'page up':
          newVal = isMaxHandle ? self.max : [self.max, self._value[1]];
          break;

        case 'up':
        case 'right':
          newVal = isMaxHandle ? self._value[1] + self.step : [self._value[0] + self.step, self._value[1]];
          break;

        case 'down':
        case 'left':
          newVal = isMaxHandle ? self._value[1] - self.step : [self._value[0] - self.step, self._value[1]];
          break;
      }
      if (typeof newVal === 'undefined'
          || isNaN(newVal)
             && (isNaN(newVal[0]) || isNaN(newVal[1]))) {
        return;
      }

      //todo: emit start and stop change events
      self._setValue(newVal);

      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Fixes and sets settings on initialization.
   * @param {SliderSettings} settings
   * @private
   */
  _applySettings(settings) {
    const DEFAULT_SETTINGS = this.constructor.DEFAULT_SETTINGS;

    settings = merge({}, DEFAULT_SETTINGS, settings);
    this.constructor._fixSettings(settings);

    /** @type SliderSettings */
    this._settings = {};

    //
    if (settings.container instanceof Element) {
      this._container = settings.container;
    }
    else if (typeof settings.container === 'string') {
      this._container = document.getElementById(settings.container);
      if (!this.container) {
        throw new Error(`${this.constructor.name} initialization error: can not find element with id "${settings.container}".`);
      }
    }
    else if (typeof settings.container === 'undefined') {
      //todo: create container
      this._container = document.createElement('div');
    }
    else {
      throw new Error(`${this.constructor.name} initialization error: type of "settings.container" property is unsupported.`);
    }
    delete settings.container;

    // call setters for settings which defined in DEFAULT_SETTINGS only
    for (let key in DEFAULT_SETTINGS) {
      if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
        this[key] = settings[key];
      }
    }
  }

  /**
   * @private
   */
  _render() {
    var rootClasses = [SLIDER_CLASS];

    if (this.isRange) {
      rootClasses.push(RANGE_CLASS);
    }

    var elementHTML = `
      <div class="${rootClasses.join(' ')}">
        <div class="${SLIDER_BG}">
          <div class="${PROGRESS_CLASS}"></div>
          <div class="${HANDLE_CLASS} ${MIN_HANDLE_CLASS}" tabindex="${this.tabindex[0]}"></div>
          <div class="${HANDLE_CLASS} ${MAX_HANDLE_CLASS}" tabindex="${this.tabindex[1]}"></div>
        </div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._progressElement = this._rootElement.querySelector(`.${PROGRESS_CLASS}`);
    this._handlesContainer = this._rootElement.querySelector(`.${SLIDER_BG}`);
    this._minHandleElement = this._handlesContainer.querySelector(`.${MIN_HANDLE_CLASS}`);
    this._maxHandleElement = this._handlesContainer.querySelector(`.${MAX_HANDLE_CLASS}`);

    this.container.appendChild(this._rootElement);

    // todo: remove this code when interactive will be added
    //this._progressElement.style.width = '50%';
    //this._maxHandleElement.style.left = '50%';

  }

  _setValue(val, force) {
    if (typeof val !== 'number' && !Array.isArray(val)) {
      throw new Error(`${this.constructor.name} set value error: passed value's (${val}) type is not supported.`);
    }

    // for not range slider value can be number
    if (typeof val === 'number') {
      let minVal = this._value && this._value[0] || this.min;
      val = [minVal, val];
    }

    var isMaxChanged;

    if (typeof this._value !== 'undefined') {
      isMaxChanged = this._value[1] !== val[1];
    }

    val = helpFuncs.fixValue(val, this.min, this.max, this.step, !this.isRange, isMaxChanged);

    var valueChanged = typeof this._value === 'undefined'
                       || this._value[0] !== val[0]
                       || this._value[1] !== val[1];

    this._value = val;

    if (valueChanged || force) {
      const minPercentVal = helpFuncs.getPercent(val[0], this.max);
      const maxPercentVal = helpFuncs.getPercent(val[1], this.max);
      this._minHandleElement.style.left = `${minPercentVal}%`;
      this._maxHandleElement.style.left = `${maxPercentVal}%`;
      this._progressElement.style.left = `${minPercentVal}%`;
      this._progressElement.style.width = `${maxPercentVal - minPercentVal}%`;
      this.emit(this.constructor.EVENTS.CHANGE, this.value);
    }
  }
}

module.exports = CgSlider;