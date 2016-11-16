'use strict';

export default {

  /**
   *
   * @param {Element} element
   * @param {string} className
   */
  addClass: function addClass(element, className) {
    var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
    if (re.test(element.className)) return;
    element.className = (element.className + " " + className).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
  },

  /**
   *
   * @param {Element} element
   * @param {string} className
   */
  removeClass: function removeClass(element, className) {
    var re = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
    element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
  },

  /**
   * Removes current node from tree.
   * @param {Node} node
   */
  removeNode: function removeNode(node) {
    if (node.parentNode)
      node.parentNode.removeChild(node);
  },

  /**
   *
   * @param {string} html
   * @returns {Node}
   */
  createHTML: function createHTML(html) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
  },

  /**
   * Adds coordinates to event object independently of event from touching or mouse. (cx, cy - client coordinates, px, py - page coordinates)
   * @param event
   */
  extendEventObject: function extendEventObject(event) {
    if (event.touches && event.touches[0]) {
      event.cx = event.touches[0].clientX;
      event.cy = event.touches[0].clientY;
      event.px = event.touches[0].pageX;
      event.py = event.touches[0].pageY;
    }
    else if (event.changedTouches && event.changedTouches[0]) {
      event.cx = event.changedTouches[0].clientX;
      event.cy = event.changedTouches[0].clientY;
      event.px = event.changedTouches[0].pageX;
      event.py = event.changedTouches[0].pageY;
    }
    else {
      event.cx = event.clientX;
      event.cy = event.clientY;
      event.px = event.pageX;
      event.py = event.pageY;
    }
  }
};