'use strict';

export default {

  /**
   *
   * @param {number} percent
   * @param {number} max
   * @param {number} [min = 0]
   * @returns {number}
   */
  calcValueByPercent: function (percent, max, min = 0) {
    return min + (max - min) * percent / 100;
  },

  /**
   *
   * @param {number[]} value - array of two numbers which represent min and max values of slider.
   * @param {number} min - the minimum allowed value.
   * @param {number} max - the maximum allowed value.
   * @param {number} step - step between allowed numbers.
   * @param {boolean} [allowSameValue = true] - allow min and max values be the same. It is `false` for range slider.
   * @param {boolean} [minIsForeground = true] - min value (value[0]) is foreground.
   *                                            It is mean that if this argument is `true` and max value (value[1]) is less than min value,
   *                                            max value will be recalculated to be the same or greater than min value.
   *                                            If it is `false` min value will be recalculated regarding the max value.
   * @returns {number[]}
   */
  fixValue: function (value, min, max, step, allowSameValue = true, minIsForeground = true) {
    for (let i = 0; i < value.length; i++) {

      let minAllowed = !allowSameValue && i == 1 ? min + step : min;
      let maxAllowed = !allowSameValue && i == 0 ? max - step : max;
      let val = Math.max(minAllowed, Math.min(maxAllowed, value[i]));
      //find nearest stepped value
      value[i] = this.getSteppedNumber(val, min, step);
    }

    if (minIsForeground) {
      // max range value can not be less than min range value
      let minVal = allowSameValue ? value[0] : value[0] + step;
      value[1] = Math.max(minVal, value[1]);
    }
    else {
      // min range value can not be greater than max range value
      let maxVal = allowSameValue ? value[1] : value[1] - step;
      value[0] = Math.min(value[0], maxVal);
    }

    return value;
  },

  /**
   * Returns stepped number.
   * @param {number} num
   * @param {number} min
   * @param {number} step
   * @returns {number}
   */
  getSteppedNumber: function getSteppedNumber(num, min, step) {
    let steps = (num - min) / step;
    let leftSteppedVal = min + Math.floor(steps) * step;
    let rightSteppedVal = min + Math.ceil(steps) * step;
    let leftDiff = Math.abs(leftSteppedVal - num);
    let rightDiff = Math.abs(rightSteppedVal - num);

    return rightDiff <= leftDiff ? rightSteppedVal : leftSteppedVal;
  },

  /**
   * Returns position of the handle's center in container.
   * @param {Element} handleElement
   * @param {Element} container
   * @returns {{x: number, y: number}}
   */
  getHandlePosition: function getHandlePosition(handleElement, container) {
    const bounds = handleElement.getBoundingClientRect();
    const containerBounds = container.getBoundingClientRect();

    return {
      x: (bounds.left + bounds.right) / 2 - containerBounds.left,
      y: (bounds.top + bounds.bottom) / 2 - containerBounds.top
    };
  },

  /**
   *
   * @param {number} val
   * @param {number} max
   * @param {number} [min = 0]
   * @returns {number}
   */
  getPercent: function getPercent(val, max, min = 0) {
    return Math.min(100, Math.max(0, 100 * (val - min) / (max - min)));
  },

  /**
   * Get absolute index in range by value
   * @param {number} val
   * @param {number} min
   * @param {number} [step = 1]
   * @returns {number}
   */
  getValueIndex: function getIndex(val, min, step) {
    step = step || 1;
    return Math.round(Math.abs(min - val) / step);
  },

  /**
   * Sets attribute with `attrName` to passed element if `attrVal` is not empty otherwise remove this attribute.
   * @param {Element} element
   * @param {string} attrName
   * @param {string} [attrVal]
   */
  setAttributeOrRemoveIfEmpty: function (element, attrName, attrVal = '') {
    if (attrVal) {
      element.setAttribute(attrName, attrVal);
    }
    else {
      element.removeAttribute(attrName);
    }
  }
};