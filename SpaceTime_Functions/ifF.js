/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var core = require('./_core');

var ifF = function(src, atr)
{
  //var bool = atr[0];
  core.$L('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  core.$L(src);
  core.$L(core.$type(src) === 'Array');

  core.$L('!!atr!!');
  core.$L(atr[0]); // [true]


  if (core.$content(core.$mapMEMORY(atr[0])))
  {
    return core.$mapMEMORY(atr[1]);
  }
  else
  {
    return core.$mapMEMORY(src);
  }

};

module.exports = ifF;