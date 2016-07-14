'use strict';

require('./common.less');

var EventEmitter = require('events');
var inherits = require('inherits');

/**
 * Slider's customizing settings
 * @typedef {Object} SliderSettings
 * @property {number} min - Minimum slider value.
 * @property {number} max - Maximum slider value.
 * @property {number} step
 */

function CgSlider(settings) {
  EventEmitter.call(this);
  this._applySettings(settings);
  this._render();
  this._addListeners();
}
inherits(CgSlider, EventEmitter);

/** @type SliderSettings */
CgSlider.DEFAULT_SETTINGS = {
  min: 0,
  max: 100,
  step: 1
};

CgSlider.EVENTS = {
  CHANGE: 'change',
  START_CHANGE: 'start_change',
  STOP_CHANGE: 'stop_change'
};

CgSlider.prototype._addListeners = function _addListeners() {
  //todo:
};

CgSlider.prototype._applySettings = function (settings) {
  /** @type SliderSettings */
  this.settings = merge({}, this.constructor.DEFAULT_SETTINGS, settings);
};

CgSlider.prototype._render = function () {
  //todo:
};

module.exports = CgSlider;