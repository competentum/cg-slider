'use strict';

export default {

  /**
   *
   * @param {number} percent
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  calcValueByPercent: function (percent, min, max) {
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
  fixValue: function (value, min, max, step) {
    for (let i = 0; i < value.length; i++) {
      let val = Math.max(min, Math.min(max, value[i]));
      //find nearest stepped value
      let steps = (val - min) / step;
      let leftSteppedVal = min + Math.floor(steps) * step;
      let rightSteppedVal = min + Math.ceil(steps) * step;
      let leftDiff = Math.abs(leftSteppedVal - val);
      let rightDiff = Math.abs(rightSteppedVal - val);

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

  getPercent: function (val, max) {
    return Math.min(100, Math.max(0, 100 * val / max));
  }
};