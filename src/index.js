'use strict';

import './common.less';

import EventEmitter from 'events';
import merge from 'merge';
import utils from './utils';

/**
 * Slider's customizing settings
 * @typedef {Object} SliderSettings
 * @property {Element|string} container - DOM Element or element id in which slider should be rendered.
 *                                        This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
 * @property {number} min - Minimum slider value.
 * @property {number} max - Maximum slider value.
 * @property {number} step
 */

var SLIDER_CLASS = 'cg-slider';
var SLIDER_BG = `${SLIDER_CLASS}-bg`;
var PROGRESS_CLASS = `${SLIDER_CLASS}-progress`;
var HANDLE_CLASS = `${SLIDER_CLASS}-handle`;

class CgSlider extends EventEmitter {

  /**
   *
   * @returns {SliderSettings}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      this._DEFAULT_SETTINGS = {
        min : 0,
        max : 100,
        step: 1
      };
    }
    return this._DEFAULT_SETTINGS;
  }

  static get EVENTS() {
    if (!this._EVENTS) {
      this._EVENTS = {
        CHANGE      : 'change',
        START_CHANGE: 'start_change',
        STOP_CHANGE : 'stop_change'
      };
    }
    return this._EVENTS;
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
  }

  _addListeners() {
    //todo:
  }

  _applySettings(settings) {
    const DEFAULT_SETTINGS = this.constructor.DEFAULT_SETTINGS;

    settings = merge({}, DEFAULT_SETTINGS, settings);
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
        </div>
        <div class="${HANDLE_CLASS}"></div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._progressElement = this._rootElement.querySelector(`.${PROGRESS_CLASS}`);
    this._handleElement = this._rootElement.querySelector(`.${HANDLE_CLASS}`);

    this.container.appendChild(this._rootElement);

    // todo: remove this code when interactive will be added
    this._progressElement.style.width = '50%';
    this._handleElement.style.left = '50%';
  }
}

module.exports = CgSlider;