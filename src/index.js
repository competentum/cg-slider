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
 * @property {string|string[]} ariaLabel - string that labels the current slider for screen readers. It can be array of two strings for range slider.
 *                                         For more info see [WAI-ARIA specification/#aria-label]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-label}.
 * @property {string|string[]} ariaLabelledBy - id of the element that labels the current slider. It can be array of two strings for range slider.
 *                                             This property has higher priority than `ariaLabel`.
 *                                             For more info see [WAI-ARIA specification/#aria-labelledby]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby}.
 * @property {string|string[]} ariaDescribedBy - id of the element that describes the current slider. It can be array of two strings for range slider.
 *                                               This property has higher priority than `ariaLabel` and `ariaLabelledBy`.
 *                                               For more info see [WAI-ARIA specification/#aria-describedby]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-describedby}.
 */

const SLIDER_CLASS = 'cg-slider';
const RANGE_CLASS = `${SLIDER_CLASS}-range`;
const SLIDER_BG = `${SLIDER_CLASS}-bg`;
const PROGRESS_CLASS = `${SLIDER_CLASS}-progress`;
const HANDLE_CLASS = `${SLIDER_CLASS}-handle`;
const MIN_HANDLE_CLASS = `${SLIDER_CLASS}-handle-min`;
const MAX_HANDLE_CLASS = `${SLIDER_CLASS}-handle-max`;

const LARGE_CHANGE_MULTIPLIER = 10;

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
    tabindex: [0, 0],
    ariaLabel: '',
    ariaLabelledBy: '',
    ariaDescribedBy: '',
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
        else {
          throw new Error(`${this.name} error: type of passed setting '${name}' is not supported.`);
        }
        break;

      case 'ariaLabel':
      case 'ariaLabelledBy':
      case 'ariaDescribedBy':
        if (typeof setting === 'string') {
          setting = [setting, setting];
        }
        else if (Array.isArray(setting)) {
          if (setting.length > 2) {
            setting.length = 2;
          }
          else {
            while (setting.length < 2) {
              setting.push(setting[0] || constructor.DEFAULT_SETTINGS[name]);
            }
          }
        }
        else {
          throw new Error(`${this.name} error: type of passed setting '${name}' is not supported.`);
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
    // aria labels priority
    if (settings.ariaDescribedBy) {
      settings.ariaLabel = '';
      settings.ariaLabelledBy = '';
    }
    if (settings.ariaLabelledBy) {
      settings.ariaLabel = '';
    }

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
   *
   * @returns {string|string[]}
   */
  get ariaLabel() {
    return this.getSetting('ariaLabel');
  }

  /**
   *
   * @param {string|string[]} val
   */
  set ariaLabel(val) {
    this.setSetting('ariaLabel', val);
  }

  /**
   *
   * @returns {string|string[]}
   */
  get ariaLabelledBy() {
    return this.getSetting('ariaLabelledBy');
  }

  /**
   *
   * @param {string|string[]} val
   */
  set ariaLabelledBy(val) {
    this.setSetting('ariaLabelledBy', val);
  }

  /**
   *
   * @returns {string|string[]}
   */
  get ariaDescribedBy() {
    return this.getSetting('ariaDescribedBy');
  }

  /**
   *
   * @param {string|string[]} val
   */
  set ariaDescribedBy(val) {
    this.setSetting('ariaDescribedBy', val);
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
    return this.getSetting('isRange');
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
    return this.getSetting('min');
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
    return this.getSetting('max');
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
    return this.getSetting('step');
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
   * @returns {number|number[]}
   */
  get tabindex() {
    return this.getSetting('tabindex');
  }

  /**
   *
   * @param {number|number[]} val
   */
  set tabindex(val) {
    this.setSetting('tabindex', val);
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
   * Returns value of specified setting.
   * @param {string} name - setting name.
   * @returns {*}
   */
  getSetting(name) {
    switch (name) {
      case 'min':
      case 'max':
      case 'step':
      case 'isRange':
        return this._settings[name];

      case 'tabindex':
      case 'ariaLabel':
      case 'ariaLabelledBy':
      case 'ariaDescribedBy':
        return this.isRange ? this._settings[name] : this._settings[name][1];

      default:
        throw new Error(`${this.constructor.name} getSetting error: passed setting '${name}' is not supported.`);
    }
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
        this._settings[name] = val;

        if (this._value) {
          // reset value to apply it with new limits and step
          this._setValue(this.value);
        }

        this._updateAriaLimits();
        //todo: redraw ticks
        break;

      case 'isRange':
        this._settings.isRange = !!val;
        //todo: redraw handles
        break;

      case 'tabindex':
        this._settings.tabindex = val;
        if (this._minHandleElement) {
          this._minHandleElement.setAttribute('tabindex', this._settings.tabindex[0]);
        }
        if (this._maxHandleElement) {
          this._maxHandleElement.setAttribute('tabindex', this._settings.tabindex[1]);
        }
        break;

      case 'ariaLabel':
      case 'ariaLabelledBy':
      case 'ariaDescribedBy':
        // clear other aria label settings
        this._settings.ariaLabel = ['', ''];
        this._settings.ariaLabelledBy = ['', ''];
        this._settings.ariaDescribedBy = ['', ''];
        this._settings[name] = val;

        this._updateAriaLabels();
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

  /**
   * Adds interactivity by keyboard.
   * @private
   */
  _addKeyboardListeners() {
    const self = this;

    this._minHandleElement.addEventListener('keydown', onkeydown);
    this._maxHandleElement.addEventListener('keydown', onkeydown);

    function onkeydown(e) {
      const isMaxHandle = utils.hasClass(this, MAX_HANDLE_CLASS);
      let newVal;
      let change;

      switch (keycode(e)) {
        // min value
        case 'home':
          newVal = isMaxHandle ? self.min : [self.min, self._value[1]];
          break;

        // max value
        case 'end':
          newVal = isMaxHandle ? self.max : [self.max, self._value[1]];
          break;

        // increase
        case 'up':
        case 'right':
          newVal = isMaxHandle ? self._value[1] + self.step : [self._value[0] + self.step, self._value[1]];
          break;

        // decrease
        case 'down':
        case 'left':
          newVal = isMaxHandle ? self._value[1] - self.step : [self._value[0] - self.step, self._value[1]];
          break;

        // Large increase
        case 'page up':
          change = LARGE_CHANGE_MULTIPLIER * self.step;
          newVal = isMaxHandle ? self._value[1] + change : [self._value[0] + change, self._value[1]];
          break;

        // Large decrease
        case 'page down':
          change = LARGE_CHANGE_MULTIPLIER * self.step;
          newVal = isMaxHandle ? self._value[1] - change : [self._value[0] - change, self._value[1]];
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
   * Makes slider handles draggable.
   * @private
   */
  _makeDraggable() {
    const self = this;
    //todo: touch events
    this._minHandleElement.addEventListener('mousedown', onmousedown);
    this._maxHandleElement.addEventListener('mousedown', onmousedown);

    let dragData = {
      startHandlePos: null,
      startMousePos: null,
      dragHandle: null,
      containerWidth: null
    };

    //todo: move handlers to prototype
    function onmousedown(e) {
      utils.extendEventObject(e);

      dragData.dragHandle = this;
      dragData.isMaxHandle = utils.hasClass(dragData.dragHandle, MAX_HANDLE_CLASS);
      dragData.containerWidth = self._handlesContainer.getBoundingClientRect().width;
      dragData.startHandlePos = helpFuncs.getHandlePosition(dragData.dragHandle, self._handlesContainer);
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
      let value = helpFuncs.calcValueByPercent(percent, self.max, self.min);

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
    let rootClasses = [SLIDER_CLASS];

    if (this.isRange) {
      rootClasses.push(RANGE_CLASS);
    }

    const elementHTML = `
      <div class="${rootClasses.join(' ')}">
        <div class="${SLIDER_BG}">
          <div class="${PROGRESS_CLASS}"></div>
          <div class="${HANDLE_CLASS} ${MIN_HANDLE_CLASS}" tabindex="${this._settings.tabindex[0]}" role="slider"></div>
          <div class="${HANDLE_CLASS} ${MAX_HANDLE_CLASS}" tabindex="${this._settings.tabindex[1]}" role="slider"></div>
        </div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._progressElement = this._rootElement.querySelector(`.${PROGRESS_CLASS}`);
    this._handlesContainer = this._rootElement.querySelector(`.${SLIDER_BG}`);
    this._minHandleElement = this._handlesContainer.querySelector(`.${MIN_HANDLE_CLASS}`);
    this._maxHandleElement = this._handlesContainer.querySelector(`.${MAX_HANDLE_CLASS}`);

    this._updateAriaLimits();
    this._updateAriaLabels();

    this.container.appendChild(this._rootElement);
  }

  _updateAriaLabels() {
    const settings = this._settings;
    const minHandle = this._minHandleElement;
    const maxHandle = this._maxHandleElement;

    if (!minHandle || !maxHandle)
      return;

    helpFuncs.setAttributeOrRemoveIfEmpty(minHandle, 'aria-label', settings.ariaLabel[0]);
    helpFuncs.setAttributeOrRemoveIfEmpty(maxHandle, 'aria-label', settings.ariaLabel[1]);

    helpFuncs.setAttributeOrRemoveIfEmpty(minHandle, 'aria-labelledby', settings.ariaLabelledBy[0]);
    helpFuncs.setAttributeOrRemoveIfEmpty(maxHandle, 'aria-labelledby', settings.ariaLabelledBy[1]);

    helpFuncs.setAttributeOrRemoveIfEmpty(minHandle, 'aria-describedby', settings.ariaDescribedBy[0]);
    helpFuncs.setAttributeOrRemoveIfEmpty(maxHandle, 'aria-describedby', settings.ariaDescribedBy[1]);
  }

  /**
   * Updates aria-valuemin/aria-valuemax attributes for handles.
   * @private
   */
  _updateAriaLimits() {
    const minHandle = this._minHandleElement;
    const maxHandle = this._maxHandleElement;

    if (!minHandle || !maxHandle)
      return;

    //todo: add aria-value formatter
    minHandle.setAttribute('aria-valuemin', this.min);
    minHandle.setAttribute('aria-valuemax', this.max);

    maxHandle.setAttribute('aria-valuemin', this.min);
    maxHandle.setAttribute('aria-valuemax', this.max);
  }



  /**
   * Sets slider value.
   * @param {number|Array} val - New value.
   * @param {boolean} [force=false] - If `true` will set value with emitting CHANGE event even value is not changed.
   * @private
   */
  _setValue(val, force = false) {
    if (typeof val !== 'number' && !Array.isArray(val)) {
      throw new Error(`${this.constructor.name} set value error: passed value's (${val}) type is not supported.`);
    }

    // for not range slider value can be number
    if (typeof val === 'number') {
      let minVal = this._value && this._value[0] || this.min;
      val = [minVal, val];
    }

    let isMaxChanged;

    if (typeof this._value !== 'undefined') {
      isMaxChanged = this._value[1] !== val[1];
    }

    val = helpFuncs.fixValue(val, this.min, this.max, this.step, !this.isRange, isMaxChanged);

    const valueChanged = typeof this._value === 'undefined'
                         || this._value[0] !== val[0]
                         || this._value[1] !== val[1];

    this._value = val;

    if (valueChanged || force) {
      const minPercentVal = helpFuncs.getPercent(val[0], this.max, this.min);
      const maxPercentVal = helpFuncs.getPercent(val[1], this.max, this.min);
      this._minHandleElement.style.left = `${minPercentVal}%`;
      this._maxHandleElement.style.left = `${maxPercentVal}%`;
      //todo: add aria-value formatter
      this._minHandleElement.setAttribute('aria-valuenow', val[0]);
      this._maxHandleElement.setAttribute('aria-valuenow', val[1]);
      this._progressElement.style.left = `${minPercentVal}%`;
      this._progressElement.style.width = `${maxPercentVal - minPercentVal}%`;
      this.emit(this.constructor.EVENTS.CHANGE, this.value);
    }
  }
}

module.exports = CgSlider;