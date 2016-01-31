'use strict';

/* globals describe, it */

var chai = require('chai');
//var should = chai.should();
var expect = chai.expect;

var miniAssign = require('../');


describe('#assign()', function() {


  it('expect assign() to copy own properties', function() {

    var obj1 = {
      prop1: 'prop1',
      prop2: 'prop2',
      prop3: {
        prop31: 'prop31'
      },
      prop5: {
        prop51: 'prop51',
        prop52: 'prop52'
      }
    };
    var obj2 = {
      prop2: 'prop2',
      prop4: {
        prop41: 'prop41'
      },
      prop5: {
        prop52: 'prop52',
        prop53: 'prop53'
      }
    };
    var res = {};

    miniAssign.assign(res, obj1);
    expect(res).eql(obj1);

    miniAssign.assign(res, obj2);
    expect(res).contains(obj2);

  });


  it('should assign() not copy prototype properties', function() {

    var Obj = function() {
      this.prop1 = 'prop1';
    };
    Obj.prototype.prop2 = 'prop2';
    var obj = new Obj();
    var res = {};

    miniAssign.assign(res, obj);
    expect(res).to.contain.all.keys('prop1');
    expect(res).to.not.contain.keys('prop2');

  });


  it('expect assign() to throw if target is null or undefined', function() {

    expect(function() {
      miniAssign.assign(null);
    }).throw(TypeError);

    expect(function() {
      miniAssign.assign(undefined);
    }).throw(TypeError);

  });

  it('expect assign() to accept null and undefined source', function() {

    var obj = {};
    var res;

    res = miniAssign.assign(obj, null);
    expect(res).to.deep.equals(obj);


    res = miniAssign.assign(obj, undefined);
    expect(res).to.deep.equals(obj);

  });


});


describe('#completAssign()', function() {


  it('expect completeAssign() to copy getters', function() {
    var obj = {
      foo: 1,
           get bar() {
             return 2;
           }
    };

    var res = miniAssign.completeAssign({}, obj);

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

    var res = miniAssign.completeAssign({}, obj);

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

    var res = miniAssign.completeAssign({}, obj);

    var objectSymbols = Object.getOwnPropertySymbols(res);
    expect(objectSymbols).to.have.length(0);
  });



});
