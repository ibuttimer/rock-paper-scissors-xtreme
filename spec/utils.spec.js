/*
  Test suite for utils.js
 */
import { variableCheck, requiredVariable } from '../assets/js/utils.js'

describe("check variableCheck()", function() {
  it("checks variableCheck(null) is false", function() {
      expect(variableCheck(null, 'name', false)).toBe(false);
  });

  it("checks variableCheck(undefined) is false", function() {
    expect(variableCheck(undefined, 'name', false)).toBe(false);
  });

  it("checks variableCheck(1) is true", function() {
    expect(variableCheck(1, 'name', false)).toBe(true);
  });
});


describe("check requiredVariable()", function() {
  it("checks requiredVariable(null) is false", function() {
      expect(requiredVariable(null, 'name', false))
        .toBe(false);
  });

  it("checks requiredVariable(undefined) is false", function() {
    expect(requiredVariable(undefined, 'name', false))
      .toBe(false);
  });

  it("checks requiredVariable(1) is true", function() {
    expect(requiredVariable(1, 'name', false))
      .toBe(true);
  });

  it("checks requiredVariable(undefined) throws error", function() {
    const name = 'name';
    // Checking exception for a function with parameter is not supported in jasmine, so wrap in anonymous function
    expect(function() {
        requiredVariable(undefined, name, true);
      })
      .toThrowError(`Missing '${name}': null or undefined`);
  });
});
