/**
 * Created by alykoshin on 22.01.16.
 */

'use strict';

/**
 * Node 0.10-0.12 does not supports Object.assign()
 * Instead of modifying Object with polyfill we define private function object_assign()
 *
 * Source below is based upon
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
 */
// This is an assign function that copies full descriptors
//function completeAssign(target, ...sources) {
function completeAssign(target /*..sources*/) {
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    //sources.forEach(source => {

    //let descriptors = Object.keys(source).reduce((descriptors, key) => {
    var descriptors = Object.keys(source).reduce( function(descriptors, key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source).forEach(function(sym) {
      var descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }

    });

    Object.defineProperties(target, descriptors);
    //});
  }
  return target;
}


module.exports = completeAssign;
