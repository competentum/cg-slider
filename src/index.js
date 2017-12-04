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
 * @property {Element|string} container - DOM Element or element id in which slider instance should be rendered.
 *                                        This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
 * @property {number|number[]} initialValue - Value which will be set on initialization.
 * @property {boolean} disabled - Disables the slider if set to true.
 * @property {boolean} isRange - Whether the slider represents a range.
 *                               If set to true, the slider will detect if you have two handles and create a styleable range element between these two.
 * @property {number} min - The minimum value of the slider.
 * @property {number} max - The maximum value of the slider.
 * @property {number} step - Determines the size or amount of each interval or step the slider takes between the min and max.
 *                           The full specified value range of the slider (max - min) should be evenly divisible by the step.
 * @property {number|number[]} tabindex - Tabindex of handle element. It can be array of two numbers for the range slider.
 * @property {string|string[]} ariaLabel - String that labels the current slider for screen readers. It can be array of two strings the for range slider.
 *                                         For more info see [WAI-ARIA specification/#aria-label]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-label}.
 * @property {string|string[]} ariaLabelledBy - Id of the element that labels the current slider. It can be array of two strings for the range slider.
 *                                             This property has higher priority than `ariaLabel`.
 *                                             For more info see [WAI-ARIA specification/#aria-labelledby]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby}.
 * @property {string|string[]} ariaDescribedBy - Id of the element that describes the current slider. It can be array of two strings for the range slider.
 *                                               This property has higher priority than `ariaLabel` and `ariaLabelledBy`.
 *                                               For more info see [WAI-ARIA specification/#aria-describedby]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-describedby}.
 * @property {function(number):string} ariaValueTextFormatter - Label formatter callback. It receives value as a parameter and should return corresponding label.
 *                                                              For more info see [WAI-ARIA specification/#aria-valuetext]{@link https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext}.
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
    disabled: false,
    initialValue: null,
    isRange: false,
    min: 0,
    max: 100,
    step: 1,
    tabindex: [0, 0],
    ariaLabel: '',
    ariaLabelledBy: '',
    ariaDescribedBy: '',
    ariaValueTextFormatter: val => val.toString()
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
      case 'disabled':
        setting = !!setting;
        break;
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
      
      case 'ariaValueTextFormatter':
        if (typeof setting !== 'function') {
          throw new Error(`${this.name} error: type of passed setting '${name}' must be a function.`);
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
   * Returns true if two passed slider value are equal.
   * @param {number[]|undefined} val_1 - slider value. Can be array of 2 numbers or undefined.
   * @param {number[]|undefined} val_2 - same as val_1
   * @return {boolean}
   * @private
   */
  static _valuesAreEqual(val_1, val_2) {
    // both of values are undefined
    if (val_1 === val_2)
      return true;

    // one of values is undefined
    if (typeof val_1 === 'undefined'
        || typeof val_2 === 'undefined') {
      return false;
    }

    if (!Array.isArray(val_1) || !Array.isArray(val_2))
      throw new Error(`${this.name} error: type of passed value is not supported. It must be array of two numbers.`);

    return val_1[0] === val_2[0]
           && val_1[1] === val_2[1];
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
   * 
   * @returns {function}
   */
  get ariaValueTextFormatter() {
    return this.getSetting('ariaValueTextFormatter');
  }

  /**
   * 
   * @param {function(number):string} val
   */
  set ariaValueTextFormatter(val) {
    this.setSetting('ariaValueTextFormatter', val);
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
  get disabled() {
    return this.getSetting('disabled');
  }

  /**
   *
   * @param {boolean} val
   */
  set disabled(val) {
    this.setSetting('disabled', val);
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
   * Returns value of the specified setting.
   * @param {string} name - setting name.
   * @returns {*}
   */
  getSetting(name) {
    switch (name) {
      case 'disabled':
      case 'min':
      case 'max':
      case 'step':
      case 'isRange':
      case 'ariaValueTextFormatter':
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
      case 'disabled':
        this._settings.disabled = val;
        this._updateDisabled();
        break;

      case 'min':
      case 'max':
      case 'step':
        this._settings[name] = val;

        if (this._value) {
          // reset value to apply it with new limits and step
          this._setValue(this.value, true);
        }

        this._updateAriaLimits();
        //todo: redraw ticks
        break;

      //todo: remove this setting from this method to make it readable only.
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

      case 'ariaValueTextFormatter':
        this._settings[name] = val;
        if (typeof this._value !== 'undefined') {
          this._updateAriaValueTexts(this._value[0], this._value[1]);
        }
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
    let eventsData = {
      startValue: null,
      startChangeEmitted: null,
    };

    this._minHandleElement.addEventListener('keydown', onKeyDown);
    this._maxHandleElement.addEventListener('keydown', onKeyDown);

    function onKeyDown(e) {
      if (self.disabled)
        return;

      const currentHandle = this;
      const isMaxHandle = utils.hasClass(currentHandle, MAX_HANDLE_CLASS);
      let newVal;
      let change;

      if (eventsData.startValue === null) {
        eventsData.startValue = self._value;
      }

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

        default:
          // not supported keys
          return;
      }
      if (typeof newVal === 'undefined'
          || isNaN(newVal)
             && (isNaN(newVal[0]) || isNaN(newVal[1]))) {
        return;
      }

      // emit start change event if value will be changed
      if (!eventsData.startChangeEmitted
          && !self.constructor._valuesAreEqual(eventsData.startValue, self._prepareValueToSet(newVal))) {
        eventsData.startChangeEmitted = true;
        self.emit(self.constructor.EVENTS.START_CHANGE, self.value);
        currentHandle.addEventListener('keyup', onKeyboardChangeStop);
        currentHandle.addEventListener('blur', onKeyboardChangeStop);
      }

      self._setValue(newVal);

      e.preventDefault();
      e.stopPropagation();
    }

    function onKeyboardChangeStop() {
      this.removeEventListener('keyup', onKeyboardChangeStop);
      this.removeEventListener('blur', onKeyboardChangeStop);

      if (eventsData.startChangeEmitted) {
        self.emit(self.constructor.EVENTS.STOP_CHANGE, self.value);
      }

      // clear eventsData
      for (let key in eventsData) {
        if (eventsData.hasOwnProperty(key)) {
          eventsData[key] = null;
        }
      }
    }
  }

  /**
   * Makes slider handles draggable.
   * @private
   */
  _makeDraggable() {
    const self = this;
    this._minHandleElement.addEventListener('mousedown', onMouseDown);
    this._minHandleElement.addEventListener('touchstart', onMouseDown);
    this._maxHandleElement.addEventListener('mousedown', onMouseDown);
    this._maxHandleElement.addEventListener('touchstart', onMouseDown);

    let dragData = {
      startValue: null,
      startHandlePos: null,
      startMousePos: null,
      dragHandle: null,
      containerWidth: null,
      startChangeEmitted: null,
    };

    //todo: move handlers to prototype
    function onMouseDown(e) {
      if (self.disabled)
        return;

      utils.extendEventObject(e);

      dragData.startValue = self._value;
      dragData.dragHandle = this;
      dragData.isMaxHandle = utils.hasClass(dragData.dragHandle, MAX_HANDLE_CLASS);
      dragData.containerWidth = self._handlesContainer.getBoundingClientRect().width;
      dragData.startHandlePos = helpFuncs.getHandlePosition(dragData.dragHandle, self._handlesContainer);
      dragData.startMousePos = {
        x: e.px,
        y: e.py
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onMouseUp);
    }

    function onMouseMove(e) {
      utils.extendEventObject(e);

      const percent = helpFuncs.getPercent(dragData.startHandlePos.x + e.px - dragData.startMousePos.x, dragData.containerWidth);
      let value = helpFuncs.calcValueByPercent(percent, self.max, self.min);

      value = dragData.isMaxHandle ? value : [value, self._value[1]];

      // emit start change event if value will be changed
      if (!dragData.startChangeEmitted
          && !self.constructor._valuesAreEqual(dragData.startValue, self._prepareValueToSet(value))) {
        dragData.startChangeEmitted = true;
        self.emit(self.constructor.EVENTS.START_CHANGE, self.value);
      }

      self._setValue(value);

      e.preventDefault();
    }

    function onMouseUp(e) {
      utils.extendEventObject(e);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);

      if (dragData.startChangeEmitted) {
        self.emit(self.constructor.EVENTS.STOP_CHANGE, self.value);
      }

      // clear dragData
      for (let key in dragData) {
        if (dragData.hasOwnProperty(key)) {
          dragData[key] = null;
        }
      }

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
          <div class="${HANDLE_CLASS} ${MIN_HANDLE_CLASS}" tabindex="${this._settings.tabindex[0]}" role="slider" aria-orientation="horizontal"></div>
          <div class="${HANDLE_CLASS} ${MAX_HANDLE_CLASS}" tabindex="${this._settings.tabindex[1]}" role="slider" aria-orientation="horizontal"></div>
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
    this._updateDisabled();

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
   * Update aria-valuetext attributes for both handles
   * @private
   * @param {number} valMin Min handle value
   * @param {number} valMax Max handle value
   */
  _updateAriaValueTexts(valMin, valMax) {
    const { ariaValueTextFormatter } = this._settings;
    const minValueText = ariaValueTextFormatter.call(this, valMin);
    const maxValueText = ariaValueTextFormatter.call(this, valMax);
    this._minHandleElement.setAttribute('aria-valuetext', minValueText);
    this._maxHandleElement.setAttribute('aria-valuetext', maxValueText);
  }

  _updateDisabled() {
    if (!this._rootElement)
      return;

    if (this._settings.disabled) {
      this._rootElement.setAttribute('disabled', 'true');
      this._minHandleElement.setAttribute('tabindex', '-1');
      this._maxHandleElement.setAttribute('tabindex', '-1');
    }
    else {
      this._rootElement.removeAttribute('disabled');
      // restore tabindex
      this.tabindex = this.tabindex;
    }
  }

  /**
   * Fixes passed value according to current settings.
   * @param {number|number[]} val
   * @return {number[]}
   * @private
   */
  _prepareValueToSet(val) {
    // for not range slider value can be number
    // so it should be converted to array
    if (typeof val === 'number') {
      let minVal;
      // reset set minimum value for non-range if its larger than maximum
      if (this.isRange) {
        minVal = this._value && this._value[0] || this.min;
      } else {
        minVal = this._value && this._value[0] <= val ? this._value[0] : this.min;
      }
      val = [minVal, val];
    }

    let isMaxChanged;

    if (typeof this._value !== 'undefined') {
      isMaxChanged = this._value[1] !== val[1];
    }

    val = helpFuncs.fixValue(val, this.min, this.max, this.step, !this.isRange, isMaxChanged);

    return val;
  }

  /**
   * Sets slider value.
   * @param {number|number[]} val - New value.
   * @param {boolean} [force=false] - If `true` will set value with emitting CHANGE event even value is not changed.
   * @private
   */
  _setValue(val, force = false) {
    if (typeof val !== 'number' && !Array.isArray(val)) {
      throw new Error(`${this.constructor.name} set value error: passed value's (${val}) type is not supported.`);
    }

    val = this._prepareValueToSet(val);

    const valueChanged = !this.constructor._valuesAreEqual(this._value, val);

    this._value = val;

    if (valueChanged || force) {
      const minPercentVal = helpFuncs.getPercent(val[0], this.max, this.min);
      const maxPercentVal = helpFuncs.getPercent(val[1], this.max, this.min);
      this._minHandleElement.style.left = `${minPercentVal}%`;
      this._maxHandleElement.style.left = `${maxPercentVal}%`;
      //todo: add aria-value formatter
      this._minHandleElement.setAttribute('aria-valuenow', val[0]);
      this._maxHandleElement.setAttribute('aria-valuenow', val[1]);

      this._updateAriaValueTexts(val[0], val[1]);

      this._progressElement.style.left = `${minPercentVal}%`;
      this._progressElement.style.width = `${maxPercentVal - minPercentVal}%`;
      this.emit(this.constructor.EVENTS.CHANGE, this.value);
    }
  }
}

module.exports = CgSlider;