/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var ifF = function(src, atr)
{
  //var bool = atr[0];
  //console.log('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  M.$L('!!!!!!!!!! ifF   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  M.$L(src);
  M.$L(M.$type(src) === 'Array');


  ///-------
  if(M.$content(M.$mapEVAL(src)))
  {
  //  console.log('!!!!!!!!!! ifF  Matched');
    return M.$mapEVAL(atr[0]);
  }
  else
  {
  //  console.log('!!!!!!!!!! ifF  unMatched');
    return M.$mapEVAL(atr[1]);
  }



};

module.exports = ifF;
