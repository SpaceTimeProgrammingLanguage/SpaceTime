/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./_core');

var ifF = function(src, atr)
{
  //var bool = atr[0];
  M.$L('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  M.$L(src);
  M.$L(M.$type(src) === 'Array');

  M.$L('!!atr!!');
  M.$L(atr[0]); // [true]


  if (M.$content(M.$mapMEMORY(atr[0])))
  {
    return M.$mapMEMORY(atr[1]);
  }
  else
  {
    return M.$mapMEMORY(src);
  }

};

module.exports = ifF;