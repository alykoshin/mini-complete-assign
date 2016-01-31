'use strict';

/* globals describe, it */

var chai = require('chai');
//var should = chai.should();
var expect = chai.expect;

var completeAssign = require('../');


describe('#completAssign()', function() {


  it('expect completeAssign() to copy getters', function() {
    var obj = {
      foo: 1,
           get bar() {
             return 2;
           }
    };

    var res = completeAssign({}, obj);

    expect(res).eql(obj);
    expect(res).to.contain.all.keys('foo', 'bar');
    expect(res.bar).to.be.a('number');
    expect(res.bar).equals(2);
  });

  it('expect completeAssign() to copy symbol properties', function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
    var obj = {};
    var symA = Symbol('a');
    var valA = 'localSymbol';
    var symB = Symbol.for('symB');
    var valB = 'globalSymbol';
    obj[symA] = valA;
    obj[symB] = valB;

    var res = completeAssign({}, obj);

    var objectSymbols = Object.getOwnPropertySymbols(res);
    expect(objectSymbols).to.have.length(2);
    expect(obj[symA] === valA);
    expect(obj[symB] === valB);
  });

  it('expect completeAssign() to not copy symbol properties with non-enumerable descriptors', function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
    var obj = {};
    Object.defineProperty(obj, 'baz', { value: 8675309, writable: false, enumerable: false });
    //var d = Object.getOwnPropertyDescriptor(obj, 'baz');
    // // d is { value: 8675309, writable: false, enumerable: false, configurable: false }
    var symC = Symbol('c');
    Object.defineProperty(obj, symC, { value: 8675309, writable: false, enumerable: false });

    var res = completeAssign({}, obj);

    var objectSymbols = Object.getOwnPropertySymbols(res);
    expect(objectSymbols).to.have.length(0);
  });



});
