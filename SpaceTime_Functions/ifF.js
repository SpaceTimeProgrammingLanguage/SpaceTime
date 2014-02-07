/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var ifF = function(src, atr)
{
  //var bool = atr[0];
  M.$L('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  M.$L(src);
  M.$L(M.$type(src) === 'Array');

  M.$L('!!atr!!');
  M.$L(atr[0]); // [true]


  if (M.$content(M.map(atr[0], [M.MEMORY])))
  {
    return M.map(atr[1], [M.MEMORY]);
  }
  else
  {
    return M.map(src, [M.MEMORY]);
  }

};

module.exports = ifF;