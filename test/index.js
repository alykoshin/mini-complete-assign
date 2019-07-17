'use strict';

/* globals describe, it */

const chai = require('chai');
//var should = chai.should();
const expect = chai.expect;

const completeAssign = require('../');


describe('#completAssign()', function() {


  it('expect completeAssign() to copy getters', function() {
    const obj = {
      foo: 1,
      get bar() {
        return 2;
      }
    };

    const res = completeAssign({}, obj);

    expect(res).eql(obj);
    console.log('res:', res);

    expect(res).to.contain.all.keys('foo', 'bar');
    console.log('res:', res);

    expect(res.bar).to.be.a('number');
    console.log('res:', res.bar);

    expect(res.bar).equals(2);
    console.log('res:', res.bar);
  });


  it('expect completeAssign() to copy symbol properties', function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
    const obj = {};
    const symA = Symbol('a');
    const valA = 'localSymbol';
    const symB = Symbol.for('symB');
    const valB = 'globalSymbol';
    obj[symA] = valA;
    obj[symB] = valB;

    const res = completeAssign({}, obj);

    const objectSymbols = Object.getOwnPropertySymbols(res);
    expect(objectSymbols).to.have.length(2);
    expect(obj[symA] === valA);
    expect(obj[symB] === valB);
  });


  it('expect completeAssign() to not copy symbol properties with non-enumerable descriptors', function() {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols
    const obj = {};
    Object.defineProperty(obj, 'baz', { value: 8675309, writable: false, enumerable: false });
    //var d = Object.getOwnPropertyDescriptor(obj, 'baz');
    // // d is { value: 8675309, writable: false, enumerable: false, configurable: false }
    const symC = Symbol('c');
    Object.defineProperty(obj, symC, { value: 8675309, writable: false, enumerable: false });

    expect( Object.getOwnPropertyNames(obj) ).to.have.length(1);
    expect( Object.getOwnPropertySymbols(obj) ).to.have.length(1);

    const res = completeAssign({}, obj);

    expect( Object.getOwnPropertyNames(res) ).to.have.length(0);
    expect( Object.getOwnPropertySymbols(res) ).to.have.length(0);
  });
});
