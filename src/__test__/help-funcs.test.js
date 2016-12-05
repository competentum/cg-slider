'use strict';
var helpFuncs = require('./../help-funcs').default;

describe('Help functions:', function () {

  describe('calcValueByPercent', function () {
    it('should calculate right value', function () {
      expect(helpFuncs.calcValueByPercent(30, 0, 10)).toBe(3);
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
  });

  describe('getPercent', function() {
    it('should calculate right value', function () {
      expect(helpFuncs.getPercent(15, 20)).toEqual(75);
    });

    it('should limit value: it can not be greater than 100', function () {
      expect(helpFuncs.getPercent(25, 20)).toEqual(100);
    });

    it('should limit value: it can not be less than 0', function () {
      expect(helpFuncs.getPercent(-5, 20)).toEqual(0);
    });
  });

});
