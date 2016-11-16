'use strict';

import './common.less';

import EventEmitter from 'events';
import merge from 'merge';
import utils from './utils';
import helpFuncs from './helpFuncs';

/**
 * Slider's customizing settings
 * @typedef {Object} SliderSettings
 * @property {Element|string} container - DOM Element or element id in which slider should be rendered.
 *                                        This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
 * @property {number} min - Minimum slider value.
 * @property {number} max - Maximum slider value.
 * @property {number} step
 * @property {number|number[]} tabindex - tabindex of handle element. It can be array of two numbers for range slider.
 */

var SLIDER_CLASS = 'cg-slider';
var SLIDER_BG = `${SLIDER_CLASS}-bg`;
var PROGRESS_CLASS = `${SLIDER_CLASS}-progress`;
var HANDLE_CLASS = `${SLIDER_CLASS}-handle`;
var MIN_HANDLE_CLASS = `${SLIDER_CLASS}-handle-min`;
var MAX_HANDLE_CLASS = `${SLIDER_CLASS}-handle-max`;

class CgSlider extends EventEmitter {

  /**
   *
   * @returns {SliderSettings}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        min: 0,
        max: 100,
        step: 1,
        tabindex: [0, 0]
      };
    }
    return this._DEFAULT_SETTINGS;
  }

  static get EVENTS() {
    if (!this._EVENTS) {
      this._EVENTS = {
        CHANGE: 'change',
        START_CHANGE: 'start_change',
        STOP_CHANGE: 'stop_change'
      };
    }
    return this._EVENTS;
  }

  static _fixSetting(name, setting) {
    var constructor = this; // without this declaration IDE will highlight static variables as error
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
  static _normalizeSettings(settings) {
    for (var name in settings) {
      settings[name] = this._fixSetting(name, settings[name]);
    }

    return settings;
  }

  constructor(settings) {
    super();
    //console.log(this.keys());
    this._applySettings(settings);
    this._render();
    this._addListeners();
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
    this._settings.min = val;
    //todo:
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
    this._settings.max = val;
    //todo:
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
    this._settings.step = val;
    //todo:
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

  _addListeners() {
    //todo:
    var self = this;
    this._minHandleElement.addEventListener('mousedown', onmousedown);

    var dragData = {
      startHandlePos: null,
      startMousePos: null,
      dragHandle: null,
      containerWidth: null
    };

    function onmousedown(e) {
      utils.extendEventObject(e);

      dragData.dragHandle = this;
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
      var percent = helpFuncs.getPercent(dragData.startHandlePos.x + e.px - dragData.startMousePos.x, dragData.containerWidth)
      dragData.dragHandle.style.left = `${percent}%`;
      self._progressElement.style.width = `${percent}%`;
    }

    function onmouseup(e) {
      utils.extendEventObject(e);
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

  _applySettings(settings) {
    const DEFAULT_SETTINGS = this.constructor.DEFAULT_SETTINGS;

    settings = merge({}, DEFAULT_SETTINGS, settings);
    this.constructor._normalizeSettings(settings);

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
    for (var key in DEFAULT_SETTINGS) {
      if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
        this[key] = settings[key];
      }
    }
  }

  _render() {
    var elementHTML = `
      <div class="${SLIDER_CLASS}">
        <div class="${SLIDER_BG}">
          <div class="${PROGRESS_CLASS}"></div>
          <div class="${HANDLE_CLASS} ${MIN_HANDLE_CLASS}" tabindex="${this.tabindex[0]}"></div>
          <div class="${HANDLE_CLASS} ${MAX_HANDLE_CLASS}" tabindex="${this.tabindex[1]}" style="display: none;"></div>
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
    this._progressElement.style.width = '50%';
    this._minHandleElement.style.left = '50%';

  }
}

module.exports = CgSlider;