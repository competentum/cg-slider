'use strict';
var helpFuncs = require('./../help-funcs').default;
var jsdom = require('jsdom');
var JSDOM = jsdom.JSDOM;
var dom, window, document;
var testHtml = '<!DOCTYPE html><html><head></head><body><div id="app"><p>Hello, world! <!-- comment --><span id="span_with_space"> </span></p></div></body></html>';

describe('Help functions:', function () {

  describe('calcValueByPercent', function () {
    it('should calculate right value', function () {
      expect(helpFuncs.calcValueByPercent(30, 10, 0)).toBe(3);
    });
  });

  describe('fixValue', function () {
    it('should not change value', function () {
      expect(helpFuncs.fixValue([0, 10], 0, 100, 1)).toEqual([0, 10]);
    });

    it('should fix min and max values', function () {
      expect(helpFuncs.fixValue([-5, 105], 0, 100, 1)).toEqual([0, 100]);
    });

    it('should fix values according step', function () {
      expect(helpFuncs.fixValue([1.5, 11.3], 0, 100, 1)).toEqual([2, 11]);
    });

    it('should return value with allowed max', function () {
      expect(helpFuncs.fixValue([0, 0], 0, 100, 1, false, false)).toEqual([0, 1]);
    });

    it('should return value with allowed min', function () {
      expect(helpFuncs.fixValue([100, 100], 0, 100, 1, false, true)).toEqual([99, 100]);
    });
  });

  describe('roundValue', function() {
    it('should round decimal up to precision of 10 places', function () {
      expect(helpFuncs.roundValue(0.0)).toBe(0);
      expect(helpFuncs.roundValue(0)).toBe(0);
      expect(helpFuncs.roundValue(-0)).toBe(-0);
      expect(helpFuncs.roundValue(1.0)).toBe(1);
      expect(helpFuncs.roundValue(1.2)).toBe(1.2);
      expect(helpFuncs.roundValue(5.00000)).toBe(5);
      expect(helpFuncs.roundValue(3.00003)).toBe(3.00003);
      expect(helpFuncs.roundValue(5.50)).toBe(5.5);
      expect(helpFuncs.roundValue(1.20000000001)).toBe(1.2);
      expect(helpFuncs.roundValue(0.20001)).toBe(0.20001);
      expect(helpFuncs.roundValue(-999999999.95000000005)).toBe(-999999999.95);
    });
  });

  describe('getSteppedNumber', function () {
    it('should fix not stepped number', function () {
      expect(helpFuncs.getSteppedNumber(1.5, 0, 1)).toBe(2);
    });

    it('should fix not stepped float number', function () {
      expect(helpFuncs.getSteppedNumber(11.312, 0, .01)).toBe(11.31);
    });
  });

  describe('getPercent', function () {
    it('should calculate right value', function () {
      expect(helpFuncs.getPercent(15, 20)).toEqual(75);
    });

    it('should calculate right value with non zero minimum', function () {
      expect(helpFuncs.getPercent(15, 20, 10)).toEqual(50);
    });

    it('should limit value: it can not be greater than 100', function () {
      expect(helpFuncs.getPercent(25, 20)).toEqual(100);
    });

    it('should limit value: it can not be less than 0', function () {
      expect(helpFuncs.getPercent(-5, 20)).toEqual(0);
    });
  });

  describe('DOM manipulation', function () {
    beforeEach(function () {
      dom = new JSDOM(testHtml);
      window = dom.window;
      document = dom.window.document;
    });

    describe('removeChildElements', function () {
      test('it deletes all DOM children', function () {
        expect(document.body.children.length).toBe(1);
        var childlessElem = helpFuncs.removeChildElements(document.body);
        expect(childlessElem).toBeDefined();
        expect(childlessElem.tagName).toBe('BODY');
        expect(childlessElem).toEqual(document.body);
        expect(childlessElem.children.length).toBe(0);
      });

      test('it wont remove BODY from HTML', function () {
        expect(document.body).toBeDefined();
        var result = helpFuncs.removeChildElements(document.documentElement);
        expect(result).toBeUndefined();
        expect(document.body).toBeDefined();
      });
    });
  });  
});
