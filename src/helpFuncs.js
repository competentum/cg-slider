'use strict';

export default {

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