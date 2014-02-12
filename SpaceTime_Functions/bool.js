/* jslint node: true */
/* global describe, it, before, beforeEach, after, afterEach */

'use strict';

var M = require('./map');

var bool = function(src, atr)
{
  //                  (1 (bool (EQUAL (9) )))
  //                  (1 (bool (== (9) )))
  //var bool = atr[0];
  M.$L('!!!!!!!!!! bool   !!!!!!!!!!!!!!!!!!!!!!!!!!!');
  M.$L(src);
  M.$L(M.$type(src) === 'Array');

  M.$L('!!atr!!');
  M.$L(atr[0]); // [true]

  var valL = M.$content(M.$mapEVAL(src));
  var valR = M.$content(M.$mapEVAL(atr[1]));

  var result = function(symbol)
  {
    console.log('=======');
    console.log(symbol);
    if (symbol === M.EQUAL)
      return (valL === valR);
    else if (symbol === M.GREATER)
      return (valL > valR);
    else if (symbol === M.LESS)
      return (valL < valR);
    else if (symbol === M.GREATEREQUAL)
      return (valL >= valR);
    else if (symbol === M.LESSEQUAL)
      return (valL <= valR);
  };

  return [result(atr[0])];


};

module.exports = bool;