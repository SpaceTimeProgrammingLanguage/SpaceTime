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


  ///-------
  if(M.$mapEVAL(src))
  {
    return M.$mapEVAL(atr[0]);
  }
  else
  {
    return M.$mapEVAL(atr[1]);
  }



};

module.exports = ifF;
