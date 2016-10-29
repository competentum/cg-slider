'use strict';

import './common.less';

import EventEmitter from 'events';
import merge from 'merge';

/**
 * Slider's customizing settings
 * @typedef {Object} SliderSettings
 * @property {number} min - Minimum slider value.
 * @property {number} max - Maximum slider value.
 * @property {number} step
 */

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
    this._applySettings(settings);
    this._render();
    this._addListeners();
  }

  _addListeners() {
    //todo:
  }

  _applySettings(settings) {
    /** @type SliderSettings */
    this.settings = merge({}, this.constructor.DEFAULT_SETTINGS, settings);
  }

  _render() {
    //todo:
  }
}

module.exports = CgSlider;